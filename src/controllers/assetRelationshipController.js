const AssetRelationship = require('../models/asset_relationships');
const Asset = require('../models/assets');

async function createRelationship(req, res) {
  try {
    const { parent_asset_id, child_asset_id, relationship_type, installed_at } = req.body;

    if (!parent_asset_id || !child_asset_id) {
      return res.status(400).json({ error: 'parent_asset_id and child_asset_id are required' });
    }

    if (parent_asset_id === child_asset_id) {
      return res.status(400).json({ error: 'An asset cannot have a relationship with itself' });
    }

    const [parent, child] = await Promise.all([
      Asset.findOne({ _id: parent_asset_id, org_id: req.orgId }),
      Asset.findOne({ _id: child_asset_id, org_id: req.orgId }),
    ]);

    if (!parent) {
      return res.status(400).json({ error: 'parent_asset_id does not belong to your organization' });
    }
    if (!child) {
      return res.status(400).json({ error: 'child_asset_id does not belong to your organization' });
    }

    const relationship = await AssetRelationship.create({
      org_id: req.orgId,
      parent_asset_id,
      child_asset_id,
      relationship_type,
      installed_at: installed_at || new Date(),
    });

    res.status(201).json(relationship);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This relationship between these two assets already exists' });
    }
    res.status(500).json({ error: err.message });
  }
}

async function listRelationships(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.parent_asset_id) filter.parent_asset_id = req.query.parent_asset_id;
    if (req.query.child_asset_id) filter.child_asset_id = req.query.child_asset_id;

    const relationships = await AssetRelationship.find(filter);
    res.json(relationships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getRelationship(req, res) {
  try {
    const relationship = await AssetRelationship.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!relationship) {
      return res.status(404).json({ error: 'Relationship not found' });
    }
    res.json(relationship);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function removeRelationship(req, res) {
  try {
    const relationship = await AssetRelationship.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId, removed_at: null },
      { removed_at: new Date() },
      { new: true }
    );

    if (!relationship) {
      return res.status(404).json({ error: 'Active relationship not found' });
    }

    res.json(relationship);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteRelationship(req, res) {
  try {
    const relationship = await AssetRelationship.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!relationship) {
      return res.status(404).json({ error: 'Relationship not found' });
    }
    res.json({ message: 'Relationship deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createRelationship, listRelationships, getRelationship, removeRelationship, deleteRelationship };
