const Document = require('../models/documents');

async function createDocument(req, res) {
  try {
    const { owner_type, owner_id, document_type, file_name, mime_type, storage_provider, storage_key, checksum, immutable } = req.body;

    if (!owner_type || !owner_id) {
      return res.status(400).json({ error: 'owner_type and owner_id are required' });
    }

    const document = await Document.create({
      org_id: req.orgId,
      owner_type,
      owner_id,
      document_type,
      file_name,
      mime_type,
      storage_provider,
      storage_key,
      checksum,
      immutable,
      uploaded_by: req.userId,
    });

    res.status(201).json(document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function listDocuments(req, res) {
  try {
    const filter = { org_id: req.orgId };
    if (req.query.owner_type) filter.owner_type = req.query.owner_type;
    if (req.query.owner_id) filter.owner_id = req.query.owner_id;
    const documents = await Document.find(filter).sort({ uploaded_at: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDocument(req, res) {
  try {
    const document = await Document.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteDocument(req, res) {
  try {
    const document = await Document.findOne({ _id: req.params.id, org_id: req.orgId });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    if (document.immutable) {
      return res.status(409).json({ error: 'This document is immutable and cannot be deleted' });
    }
    await Document.deleteOne({ _id: document._id });
    res.json({ message: 'Document deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createDocument, listDocuments, getDocument, deleteDocument };
