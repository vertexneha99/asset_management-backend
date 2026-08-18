const Asset = require('../models/assets');
const ItemMaster = require('../models/item_masters');

function slugify(text) {
  return (text || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Assets are serialized units of a catalog entry (ItemMaster). The frontend
 * only knows "name/category/brand/model" on the asset itself, so on create
 * we find-or-create the matching ItemMaster (by name+brand+model within the
 * org) rather than requiring the caller to manage item masters separately.
 */
async function findOrCreateItemMaster(orgId, { name, brand, model }) {
  let itemMaster = await ItemMaster.findOne({ org_id: orgId, name, brand, model });
  if (itemMaster) return itemMaster;

  const baseSku = slugify(`${brand || ''}-${model || ''}`) || slugify(name) || 'item';
  const sku = `${baseSku}-${Date.now().toString(36)}`;

  itemMaster = await ItemMaster.create({
    org_id: orgId,
    sku,
    name,
    brand,
    model,
  });
  return itemMaster;
}

/**
 * Flattens an Asset doc (with item_master_id populated) into the shape
 * lib/models/asset.dart's Asset.fromJson expects. Keep in sync with that
 * file and with toAssetWriteFields below.
 */
function toAssetDto(asset) {
  const itemMaster = asset.item_master_id || {};
  const classification = asset.classification || {};
  const identity = asset.identity || {};
  const lifecycle = asset.lifecycle || {};
  const ownership = asset.ownership || {};
  const acquisition = asset.acquisition || {};
  const warranty = asset.warranty_snapshot || {};
  const visibility = asset.visibility || {};
  const trash = asset.trash || {};

  return {
    id: asset._id,
    assetTag: asset.asset_tag,
    name: itemMaster.name || '',
    brand: itemMaster.brand || '',
    model: itemMaster.model || '',
    category: classification.category || '',
    subcategory: classification.subcategory || '',
    assetType: classification.asset_type || '',
    color: classification.color || null,
    description: asset.description || '',

    serialNumber: identity.serial_number || '',
    imei: identity.imei || null,
    barcode: identity.barcode || null,
    rfid: identity.rfid || null,

    purchaseDate: acquisition.purchase_date || null,
    purchasePrice: acquisition.purchase_price || 0,
    vendor: acquisition.vendor || '',
    poNumber: acquisition.po_number || null,
    invoiceNumber: acquisition.invoice_number || null,
    receivedDate: acquisition.received_date || null,

    department: ownership.department || '',
    location: ownership.location || '',
    roomId: ownership.room_id || null,
    assignedTo: ownership.assigned_to || null,
    custodian: ownership.custodian || null,
    costCentre: ownership.cost_centre || null,

    warrantyStart: warranty.start || null,
    warrantyEnd: warranty.end || null,
    warrantyProvider: warranty.provider || null,
    warrantyType: warranty.type || null,

    status: lifecycle.status || 'Available',
    condition: lifecycle.condition || 'Good',
    criticality: lifecycle.criticality || 'Medium',
    usefulLifeYears: lifecycle.useful_life_years ?? 5,
    salvageValue: lifecycle.salvage_value ?? 0,
    notes: lifecycle.notes || '',
    attachments: [],
    timeline: [],

    deletedAt: trash.deleted_at || null,
    deletedBy: trash.deleted_by || null,
    deletionReason: trash.deletion_reason || null,
    purgeAt: trash.purge_at || null,

    visibilityType: visibility.visibility_type || 'PUBLIC',
    allowedUsers: visibility.allowed_users || [],
    allowedRoles: visibility.allowed_roles || [],
    allowedDepartments: visibility.allowed_departments || [],
    createdBy: null,
  };
}

/** Sets `target[key] = value` only when the caller actually sent a value — leaves target[key] untouched otherwise. */
function mergeField(target, key, value) {
  if (value !== undefined) target[key] = value;
}

/**
 * Inverse of toAssetDto — merges the flat request body onto [existing]'s
 * nested Mixed groups. [existing] must be the current asset's own
 * classification/identity/lifecycle/ownership/acquisition/warranty_snapshot/
 * visibility (or {} on create). Merging (not replacing) matters because
 * Mongoose overwrites a Mixed sub-document wholesale on save — a partial
 * update without this would silently blank out every field the caller
 * didn't include.
 */
function toAssetWriteFields(body, existing = {}) {
  const classification = { ...(existing.classification || {}) };
  mergeField(classification, 'category', body.category);
  mergeField(classification, 'subcategory', body.subcategory);
  mergeField(classification, 'asset_type', body.assetType);
  mergeField(classification, 'color', body.color);

  const identity = { ...(existing.identity || {}) };
  mergeField(identity, 'serial_number', body.serialNumber);
  mergeField(identity, 'imei', body.imei);
  mergeField(identity, 'barcode', body.barcode);
  mergeField(identity, 'rfid', body.rfid);

  const lifecycle = { ...(existing.lifecycle || {}) };
  mergeField(lifecycle, 'status', body.status);
  mergeField(lifecycle, 'condition', body.condition);
  mergeField(lifecycle, 'criticality', body.criticality);
  mergeField(lifecycle, 'useful_life_years', body.usefulLifeYears);
  mergeField(lifecycle, 'salvage_value', body.salvageValue);
  mergeField(lifecycle, 'notes', body.notes);

  const ownership = { ...(existing.ownership || {}) };
  mergeField(ownership, 'department', body.department);
  mergeField(ownership, 'location', body.location);
  mergeField(ownership, 'room_id', body.roomId);
  mergeField(ownership, 'assigned_to', body.assignedTo);
  mergeField(ownership, 'custodian', body.custodian);
  mergeField(ownership, 'cost_centre', body.costCentre);

  const acquisition = { ...(existing.acquisition || {}) };
  mergeField(acquisition, 'purchase_date', body.purchaseDate);
  mergeField(acquisition, 'purchase_price', body.purchasePrice);
  mergeField(acquisition, 'vendor', body.vendor);
  mergeField(acquisition, 'po_number', body.poNumber);
  mergeField(acquisition, 'invoice_number', body.invoiceNumber);
  mergeField(acquisition, 'received_date', body.receivedDate);

  const warranty_snapshot = { ...(existing.warranty_snapshot || {}) };
  mergeField(warranty_snapshot, 'start', body.warrantyStart);
  mergeField(warranty_snapshot, 'end', body.warrantyEnd);
  mergeField(warranty_snapshot, 'provider', body.warrantyProvider);
  mergeField(warranty_snapshot, 'type', body.warrantyType);

  const visibility = { ...(existing.visibility || {}) };
  mergeField(visibility, 'visibility_type', body.visibilityType);
  mergeField(visibility, 'allowed_users', body.allowedUsers);
  mergeField(visibility, 'allowed_roles', body.allowedRoles);
  mergeField(visibility, 'allowed_departments', body.allowedDepartments);

  const fields = { classification, identity, lifecycle, ownership, acquisition, warranty_snapshot, visibility };
  if (body.description !== undefined) fields.description = body.description;
  return fields;
}

async function createAsset(req, res) {
  try {
    const { assetTag, name, brand, model } = req.body;

    if (!assetTag || !name) {
      return res.status(400).json({ error: 'assetTag and name are required' });
    }

    const itemMaster = await findOrCreateItemMaster(req.orgId, { name, brand, model });

    const asset = await Asset.create({
      org_id: req.orgId,
      asset_tag: assetTag,
      item_master_id: itemMaster._id,
      ...toAssetWriteFields(req.body),
      created_by: req.userId,
    });

    await asset.populate('item_master_id');
    res.status(201).json(toAssetDto(asset));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An asset with this tag already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listAssets(req, res) {
  try {
    const assets = await Asset.find({ org_id: req.orgId })
      .populate('item_master_id')
      .sort({ created_at: -1 });
    res.json(assets.map(toAssetDto));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAsset(req, res) {
  try {
    const asset = await Asset.findOne({ _id: req.params.id, org_id: req.orgId }).populate('item_master_id');
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(toAssetDto(asset));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateAsset(req, res) {
  try {
    const { assetTag, name, brand, model } = req.body;

    const existing = await Asset.findOne({ _id: req.params.id, org_id: req.orgId }).populate('item_master_id');
    if (!existing) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const update = toAssetWriteFields(req.body, existing);
    if (assetTag) update.asset_tag = assetTag;

    if (name || brand || model) {
      const itemMaster = await findOrCreateItemMaster(req.orgId, {
        name: name || existing.item_master_id.name,
        brand: brand || existing.item_master_id.brand,
        model: model || existing.item_master_id.model,
      });
      update.item_master_id = itemMaster._id;
    }

    const asset = await Asset.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      update,
      { new: true, runValidators: true }
    ).populate('item_master_id');

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json(toAssetDto(asset));
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'An asset with this tag already exists in your organization' });
    }
    res.status(500).json({ error: err.message });
  }
}

/** Soft-delete / restore / purge (Trash workflow) share the update path, keyed by the `trash` field. */
async function trashAsset(req, res) {
  try {
    const { reason, actor } = req.body;
    const now = new Date();
    const asset = await Asset.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      {
        trash: {
          deleted_at: now,
          deleted_by: actor,
          deletion_reason: reason,
          purge_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        },
      },
      { new: true }
    ).populate('item_master_id');

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(toAssetDto(asset));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function restoreAsset(req, res) {
  try {
    const asset = await Asset.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId },
      { trash: null },
      { new: true }
    ).populate('item_master_id');

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(toAssetDto(asset));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteAsset(req, res) {
  try {
    const asset = await Asset.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json({ message: 'Asset deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createAsset, listAssets, getAsset, updateAsset, trashAsset, restoreAsset, deleteAsset };
