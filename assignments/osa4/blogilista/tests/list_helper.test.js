const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

test("dummy returns one", () => {
    const blogs = [];

    const result = listHelper.dummy(blogs);
    assert.strictEqual(result, 1);
});

describe("total likes", () => {
    const listWithOneBlog = [
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5,
            __v: 0,
        },
    ];

    test("when list has only one blog, equals the likes of that", () => {
        const result = listHelper.totalLikes(listWithOneBlog);
        assert.strictEqual(result, 5);
    });

    test("when list is empty, equals zero", () => {
        const result = listHelper.totalLikes([]);
        assert.strictEqual(result, 0);
    });

    test("when list has multiple blogs, equals the sum of likes", () => {
        const blogs = [
            {
                _id: "5a422a851b54a676234d17f7",
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 7,
                __v: 0,
            },
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0,
            },
            {
                _id: "5a422b3a1b54a676234d17f9",
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
                __v: 0,
            },
        ];

        const result = listHelper.totalLikes(blogs);
        assert.strictEqual(result, 24);
    });
});

//4.5
describe("favorite blog", () => {
    test("when list is empty, returns null", () => {
        const result = listHelper.favoriteBlog([]);
        assert.strictEqual(result, null);
    });

    test("when list has only one blog, returns that blog", () => {
        const blogs = [
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0,
            },
        ];

        const result = listHelper.favoriteBlog(blogs);
        assert.deepStrictEqual(result, {
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            likes: 5,
        });
    });

    test("when list has multiple blogs, returns the one with most likes", () => {
        const blogs = [
            {
                _id: "5a422a851b54a676234d17f7",
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 7,
                __v: 0,
            },
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0,
            },
            {
                _id: "5a422b3a1b54a676234d17f9",
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
                __v: 0,
            },
        ];

        const result = listHelper.favoriteBlog(blogs);
        assert.deepStrictEqual(result, {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12,
        });
    });

    test("multiple blogs have same max likes, returns one of them", () => {
        const blogs = [
            {
                _id: "5a422a851b54a676234d17f7",
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 12,
                __v: 0,
            },
            {
                _id: "5a422b3a1b54a676234d17f9",
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
                __v: 0,
            },
        ];

        const result = listHelper.favoriteBlog(blogs);

        const isValid =
            (result.title === "React patterns" &&
                result.author === "Michael Chan" &&
                result.likes === 12) ||
            (result.title === "Canonical string reduction" &&
                result.author === "Edsger W. Dijkstra" &&
                result.likes === 12);

        assert.strictEqual(isValid, true);
    });
});

//4.6
describe("most blogs", () => {
    test("when list empty, return null", () => {
        const result = listHelper.mostBlogs([]);
        assert.strictEqual(result, null);
    });

    test("when list has only one blog, returns that author", () => {
        const blogs = [
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0,
            },
        ];

        const result = listHelper.mostBlogs(blogs);
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            blogs: 1,
        });
    });

    test("multiple blogs, return author with most", () => {
        const blogs = [
            {
                _id: "5a422a851b54a676234d17f7",
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 7,
                __v: 0,
            },
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0,
            },
            {
                _id: "5a422b3a1b54a676234d17f9",
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
                __v: 0,
            },
            {
                _id: "5a422b891b54a676234d17fa",
                title: "First class tests",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
                likes: 10,
                __v: 0,
            },
            {
                _id: "5a422ba71b54a676234d17fb",
                title: "TDD harms architecture",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
                likes: 0,
                __v: 0,
            },
            {
                _id: "5a422bc61b54a676234d17fc",
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 2,
                __v: 0,
            },
        ];

        const result = listHelper.mostBlogs(blogs);
        assert.deepStrictEqual(result, {
            author: "Robert C. Martin",
            blogs: 3,
        });
    });

    test("when multiple authors have same max blogs, returns one of them", () => {
        const blogs = [
            {
                _id: "1",
                title: "Blog 1",
                author: "Author A",
                url: "http://example.com/1",
                likes: 5,
                __v: 0,
            },
            {
                _id: "2",
                title: "Blog 2",
                author: "Author A",
                url: "http://example.com/2",
                likes: 3,
                __v: 0,
            },
            {
                _id: "3",
                title: "Blog 3",
                author: "Author B",
                url: "http://example.com/3",
                likes: 7,
                __v: 0,
            },
            {
                _id: "4",
                title: "Blog 4",
                author: "Author B",
                url: "http://example.com/4",
                likes: 2,
                __v: 0,
            },
        ];

        const result = listHelper.mostBlogs(blogs);

        // Molemmilla 2 blogia
        const isValid =
            (result.author === "Author A" && result.blogs === 2) ||
            (result.author === "Author B" && result.blogs === 2);

        assert.strictEqual(isValid, true);
    });
});

//4.7
describe("most likes", () => {
    test("when list is empty, returns null", () => {
        const result = listHelper.mostLikes([]);
        assert.strictEqual(result, null);
    });

    test("when list has only one blog, returns that author with their likes", () => {
        const blogs = [
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0,
            },
        ];

        const result = listHelper.mostLikes(blogs);
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            likes: 5,
        });
    });

    test("when list has multiple blogs, returns author with most total likes", () => {
        const blogs = [
            {
                _id: "5a422a851b54a676234d17f7",
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 7,
                __v: 0,
            },
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0,
            },
            {
                _id: "5a422b3a1b54a676234d17f9",
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
                __v: 0,
            },
            {
                _id: "5a422b891b54a676234d17fa",
                title: "First class tests",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
                likes: 10,
                __v: 0,
            },
            {
                _id: "5a422ba71b54a676234d17fb",
                title: "TDD harms architecture",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
                likes: 0,
                __v: 0,
            },
            {
                _id: "5a422bc61b54a676234d17fc",
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 2,
                __v: 0,
            },
        ];

        const result = listHelper.mostLikes(blogs);
        assert.deepStrictEqual(result, {
            author: "Edsger W. Dijkstra",
            likes: 17,
        });
    });

    test("when multiple authors have same total likes, returns one of them", () => {
        const blogs = [
            {
                _id: "1",
                title: "Blog 1",
                author: "Author A",
                url: "http://example.com/1",
                likes: 10,
                __v: 0,
            },
            {
                _id: "2",
                title: "Blog 2",
                author: "Author A",
                url: "http://example.com/2",
                likes: 5,
                __v: 0,
            },
            {
                _id: "3",
                title: "Blog 3",
                author: "Author B",
                url: "http://example.com/3",
                likes: 8,
                __v: 0,
            },
            {
                _id: "4",
                title: "Blog 4",
                author: "Author B",
                url: "http://example.com/4",
                likes: 7,
                __v: 0,
            },
        ];

        const result = listHelper.mostLikes(blogs);

        const isValid =
            (result.author === "Author A" && result.likes === 15) ||
            (result.author === "Author B" && result.likes === 15);

        assert.strictEqual(isValid, true);
    });
});
