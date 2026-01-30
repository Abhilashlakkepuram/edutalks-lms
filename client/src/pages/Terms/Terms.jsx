import React from "react";
import "../../styles/terms.css";

const Terms = () => {
    return (
        <div className="terms-page">
            <div className="terms-container">

                <h1>Terms of Service</h1>
                <p className="updated">Last updated: January 2026</p>

                <section>
                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to EduTalks. By accessing or using our platform, you agree
                        to be bound by these Terms of Service. EduTalks provides online
                        learning resources including courses, assessments, and certificates.
                    </p>
                </section>

                <section>
                    <h2>2. User Accounts</h2>
                    <p>
                        You must create an account to access certain features. You are
                        responsible for maintaining the confidentiality of your login
                        credentials and all activities under your account.
                    </p>
                </section>

                <section>
                    <h2>3. Course Access & Progress</h2>
                    <p>
                        Access to courses is granted based on your subscription plan.
                        Course progress is tracked automatically when you successfully
                        complete lesson assessments.
                    </p>
                </section>

                <section>
                    <h2>4. Assessments & Certificates</h2>
                    <p>
                        Assessments are required to complete lessons. Certificates are
                        issued only after successful completion of course requirements.
                        EduTalks reserves the right to revoke certificates in case of
                        misuse or violation of terms.
                    </p>
                </section>

                <section>
                    <h2>5. Payments & Subscriptions</h2>
                    <p>
                        Payments are securely processed through third-party providers such
                        as Razorpay. Subscription plans determine the duration of access.
                        Fees are non-refundable unless stated otherwise.
                    </p>
                </section>

                <section>
                    <h2>6. Acceptable Use</h2>
                    <p>
                        You agree not to misuse the platform, share course content illegally,
                        or attempt to bypass assessments or security mechanisms.
                    </p>
                </section>

                <section>
                    <h2>7. Intellectual Property</h2>
                    <p>
                        All content on EduTalks including courses, videos, assessments,
                        and design are the intellectual property of EduTalks and its
                        instructors. Unauthorized copying or distribution is prohibited.
                    </p>
                </section>

                <section>
                    <h2>8. Account Termination</h2>
                    <p>
                        EduTalks may suspend or terminate accounts that violate these terms
                        without prior notice.
                    </p>
                </section>

                <section>
                    <h2>9. Limitation of Liability</h2>
                    <p>
                        EduTalks is not liable for any indirect damages arising from the
                        use of the platform. We do not guarantee job placement or specific
                        outcomes from course completion.
                    </p>
                </section>

                <section>
                    <h2>10. Changes to Terms</h2>
                    <p>
                        We may update these terms at any time. Continued use of the
                        platform indicates acceptance of the updated terms.
                    </p>
                </section>

                <section>
                    <h2>11. Contact Information</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at:
                        <br />
                        <strong>support@edutalks.com</strong>
                    </p>
                </section>

            </div>
        </div>
    );
};

export default Terms;
