const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

exports.submitContact = async (req, res) => {
    try {
        const { name, email, phone, topic, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields"
            });
        }

        const newContact = await Contact.create({
            name,
            email,
            phone,
            topic,
            message
        });

        res.status(201).json({
            success: true,
            message: "Your message has been sent successfully!",
            data: newContact
        });

    } catch (error) {
        console.error("Contact Submission Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};

// Get all contacts (Admin only)
exports.getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            contacts
        });
    } catch (error) {
        console.error("Get Contacts Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Update contact status (Admin only)
exports.updateContactStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const contactId = req.params.id;

        // Find the contact first to check current status
        const contact = await Contact.findById(contactId);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        // Only send email if status is changing TO 'resolved' from something else
        if (status === "resolved" && contact.status !== "resolved") {
            const emailSubject = "Your Support Request Has Been Resolved";
            const emailBody = `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <h2 style="color: #4f46e5;">Support Request Resolved</h2>
                    <p>Dear <strong>${contact.name}</strong>,</p>
                    <p>Thank you for reaching out to our support team.</p>
                    <p>We would like to inform you that your support request regarding:</p>
                    <blockquote style="background: #f3f4f6; padding: 15px; border-left: 4px solid #4f46e5; margin: 20px 0;">
                        "${contact.topic}"
                    </blockquote>
                    <p>has been successfully resolved by our team.</p>
                    <p>If you continue to experience any issues or have further questions, please feel free to contact us again. We are always here to help.</p>
                    <p>We appreciate your patience and thank you for choosing our services.</p>
                    <br>
                    <p>Warm regards,</p>
                    <p><strong>Support Team</strong><br>EduTalks<br>support@edutalks.com</p>
                </div>
            `;

            try {
                await sendEmail(contact.email, emailSubject, emailBody);
                console.log(`✅ Resolution email sent to ${contact.email}`);
            } catch (emailError) {
                console.error("❌ Failed to send resolution email:", emailError);
                // Continue execution to update status even if email fails
            }
        }

        // Update status in DB
        contact.status = status;
        await contact.save();

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            contact
        });
    } catch (error) {
        console.error("Update Status Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Delete contact message (Admin only)
exports.deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });
    } catch (error) {
        console.error("Delete Contact Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
