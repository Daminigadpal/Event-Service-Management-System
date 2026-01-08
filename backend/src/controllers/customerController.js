const Customer = require("../models/Customer");

exports.createCustomer = async (req, res) => {
  try {
    const c = await Customer.create(req.body);
    res.status(201).json(c);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getCustomers = async (req, res) => {
  res.json(await Customer.find().populate("user"));
};

exports.getCustomer = async (req, res) => {
  const c = await Customer.findById(req.params.id).populate("user");
  if (!c) return res.status(404).json({ message: "Not found" });
  res.json(c);
};

exports.updateCustomer = async (req, res) => {
  res.json(
    await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })
  );
};

exports.deleteCustomer = async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ message: "Customer deleted" });
};
