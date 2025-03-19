const Contact = require('../../models/contact-model'); // Import the model

const createContact = async (req, res) => {
    try {
        const { username, email, mobileno, text } = req.body;

        if (!username || !email || !mobileno || !text) {
            return res.status(422).json({ error: "All fields are required" });
        }

        const newContact = new Contact({ username, email, mobileno, text });
        await newContact.save();

        res.status(201).json({ message: "Contact saved successfully", contact: newContact });
    } catch (error) {
        console.error("Error saving contact:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Export functions
module.exports = { createContact, getContacts };
