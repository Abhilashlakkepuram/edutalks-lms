const Stripe = require("stripe");

exports.createCheckoutSession = async (req, res) => {
    try {
        console.log("Create Checkout Session Request Body:", req.body);
        console.log("User:", req.user);

        // Lazy initialization or safe check
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey) {
            console.error("❌ MISSING STRIPE_SECRET_KEY in .env");
            return res.status(500).json({ success: false, message: "Server configuration error: Payment provider not set up." });
        }

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

        // DEMO MODE HANDLE: If key is the placeholder, simulate success to prevent crash
        if (stripeKey === "sk_test_placeholder_key_replace_me") {
            console.log("⚠️ USING PLACEHOLDER STRIPE KEY - SIMULATING SUCCESS");
            return res.json({
                success: true,
                url: `${clientUrl}/payment-success?courseId=${req.body.course._id}&mock=true`
            });
        }

        const stripe = new Stripe(stripeKey);

        const { course } = req.body;

        if (!course) {
            return res.status(400).json({ success: false, message: "Course required" });
        }

        // Ensure price is an integer (cents)
        const unitAmount = Math.round(course.price * 100);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            // automatic_payment_methods: { enabled: true }, // Causing issues with some test keys
            allow_promotion_codes: true,
            mode: "payment",
            customer_email: req.user.email,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: course.title
                        },
                        unit_amount: unitAmount
                    },
                    quantity: 1
                }
            ],
            // success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-success?courseId=${course._id}`,
            // cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-cancel`
            success_url: "http://localhost:5173", // Placeholder to prevent Stripe error if this function were called
            cancel_url: "http://localhost:5173"   // Placeholder
        });

        console.log("Stripe Session Created:", session.id);
        res.json({ success: true, url: session.url });
    } catch (err) {
        console.error("Stripe Error Details:", err);
        res.status(500).json({ success: false, message: "Payment failed: " + err.message });
    }
};