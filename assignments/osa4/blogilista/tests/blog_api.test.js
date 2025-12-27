const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");
const helper = require("./test_helper");

describe("when there is initially some blogs saved", () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
        await Blog.insertMany(helper.initialBlogs);
    });

    test("blogs are returned as json", async () => {
        await api
            .get("/api/blogs")
            .expect(200)
            .expect("Content-Type", /application\/json/);
    });

    test("all blogs are returned", async () => {
        const response = await api.get("/api/blogs");

        assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test("a specific blog is within the returned blogs", async () => {
        const response = await api.get("/api/blogs");

        const titles = response.body.map((r) => r.title);
        assert(titles.includes("React patterns"));
    });

    //4.9
    test("blog posts have id property instead of _id", async () => {
        const response = await api.get("/api/blogs");

        const blogs = response.body;
        blogs.forEach((blog) => {
            assert(blog.id);
            assert.strictEqual(blog._id, undefined);
        });
    });
});

//4.10
describe("addition of a new blog", () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
        await Blog.insertMany(helper.initialBlogs);
    });

    test("succeeds with valid data", async () => {
        const newBlog = {
            title: "Test Blog",
            author: "Test Author",
            url: "http://testblog.com",
            likes: 10,
        };

        await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

        const titles = blogsAtEnd.map((blog) => blog.title);
        assert(titles.includes("Test Blog"));
    });

    //4.11
    test("if likes is missing, it defaults to 0", async () => {
        const newBlog = {
            title: "Blog without likes",
            author: "Test Author",
            url: "http://example.com",
            // likes puuttuu tahalleen
        };

        const response = await api
            .post("/api/blogs")
            .send(newBlog)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        assert.strictEqual(response.body.likes, 0);
    });

    //4.12
    test("fails with status 400 if title is missing", async () => {
        const newBlog = {
            author: "Test Author",
            url: "http://example.com",
            likes: 5,
        };

        await api.post("/api/blogs").send(newBlog).expect(400);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });

    test("fails with status 400 if url is missing", async () => {
        const newBlog = {
            title: "Test Blog",
            author: "Test Author",
            likes: 5,
        };

        await api.post("/api/blogs").send(newBlog).expect(400);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
    });
});

after(async () => {
    await mongoose.connection.close();
});
