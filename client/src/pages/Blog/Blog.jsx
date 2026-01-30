import React from "react";
import "../../styles/blog.css";

const blogPosts = [
    {
        id: 1,
        title: "How to Become a Full Stack Developer in 2026",
        excerpt:
            "A step-by-step roadmap to become a job-ready full stack developer using modern technologies.",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        author: "EduTalks Team",
        date: "Jan 25, 2026",
    },
    {
        id: 2,
        title: "Why Assessments Matter More Than Watching Videos",
        excerpt:
            "Learn why completing assessments after lessons improves knowledge retention by 60%.",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
        author: "EduTalks Team",
        date: "Jan 20, 2026",
    },
    {
        id: 3,
        title: "Top 10 Skills Companies Look For in Developers",
        excerpt:
            "Beyond coding — discover the skills that make you stand out in interviews.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
        author: "EduTalks Team",
        date: "Jan 15, 2026",
    },
];

const Blog = () => {
    return (
        <div className="blog-page">

            {/* HERO */}
            <section className="blog-hero">
                <h1>EduTalks Blog</h1>
                <p>
                    Insights, learning tips, and career guidance for future developers.
                </p>
            </section>

            {/* BLOG GRID */}
            <div className="blog-grid">
                {blogPosts.map((post) => (
                    <div key={post.id} className="blog-card">
                        <img src={post.image} alt={post.title} />

                        <div className="blog-content">
                            <span className="blog-date">{post.date}</span>
                            <h3>{post.title}</h3>
                            <p>{post.excerpt}</p>

                            <div className="blog-footer">
                                <span>By {post.author}</span>
                                <button className="read-btn">Read More</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <section className="blog-cta">
                <h2>Want to become job-ready?</h2>
                <p>Explore our courses and start learning today.</p>
            </section>

        </div>
    );
};

export default Blog;
