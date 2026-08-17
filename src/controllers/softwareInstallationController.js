const SoftwareInstallation = require('../models/software_installations');
const Asset = require('../models/assets');
const SoftwareCatalog = require('../models/software_catalog');

async function createInstallation(req, res) {
  try {
    const { device_asset_id, software_id, version, build_number, installation_type, installed_by_method, license_id, installation_path, installer_hash, install_source, authorized } = req.body;

    if (!device_asset_id || !software_id) {
      return res.status(400).json({ error: 'device_asset_id and software_id are required' });
    }

    const [asset, software] = await Promise.all([
      Asset.findOne({ _id: device_asset_id, org_id: req.orgId }),
      SoftwareCatalog.findOne({ _id: software_id, org_id: req.orgId }),
    ]);

    if (!asset) {
      return res.status(400).json({ error: 'device_asset_id does not belong to your organization' });
    }
    if (!software) {
      return res.status(400).json({ error: 'software_id does not belong to your organization' });
    }

    const installation = await SoftwareInstallation.create({
      org_id: req.orgId,
      device_asset_id,
      software_id,
      version,
      build_number,
      installation_type,
      installed_by_method,
      installed_by_user_id: req.userId,
      license_id,
      installation_path,
      installer_hash,
      install_source,
      authorized,
    });

    res.status(201).json(installation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listInstallations(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.device_asset_id) filter.device_asset_id = req.query.device_asset_id;
    if (req.query.software_id) filter.software_id = req.query.software_id;
    if (req.query.current_status) filter.current_status = req.query.current_status;
    const installations = await SoftwareInstallation.find(filter);
    res.json(installations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getInstallation(req, res) {
  try {
    const installation = await SoftwareInstallation.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!installation) {
      return res.status(404).json({ error: 'Installation not found' });
    }
    res.json(installation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function uninstall(req, res) {
  try {
    const { uninstall_reason } = req.body;

    const installation = await SoftwareInstallation.findOneAndUpdate(
      { _id: req.params.id, org_id: req.orgId, current_status: { $ne: 'uninstalled' } },
      { current_status: 'uninstalled', uninstallation_date: new Date(), uninstalled_by: req.userId, uninstall_reason },
      { new: true, runValidators: true }
    );

    if (!installation) {
      return res.status(404).json({ error: 'Active installation not found' });
    }

    res.json(installation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteInstallation(req, res) {
  try {
    const installation = await SoftwareInstallation.findOneAndDelete({ _id: req.params.id, org_id: req.orgId });
    if (!installation) {
      return res.status(404).json({ error: 'Installation not found' });
    }
    res.json({ message: 'Installation deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createInstallation, listInstallations, getInstallation, uninstall, deleteInstallation };
