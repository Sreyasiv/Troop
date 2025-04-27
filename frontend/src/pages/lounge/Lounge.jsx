import React, { useEffect, useState } from "react";
import Post from "../../components/Post";
import NavBar from "../../components/NavBar"
import AddpostBar from "../../components/AddpostBar";

const dummyUser = {
    username: "Kunuen",
    course: "Computer Science",
    profilePic: "https://i.pravatar.cc/150?img=12",
};

const dummyPosts = [
    {
        id: 1,
        username: "Varsha",
        course: "BTECH-CSE_WIP",
        profilePic: "https://i.pravatar.cc/150?img=33",
        hashtags: ["#art", "#community"],
        content: "Very Dull Day.Like a prison I am living my days..No change,Very bored",
        images: []
    },
    {
        id: 2,
        username: "Sehamedh",
        course: "BTECH-CSE_WIP",
        profilePic: "https://i.pravatar.cc/150?img=45",
        hashtags: ["#code", "#react"],
        content: "I want my girl to be tall,muscular,piercing also nice only..hehehehe no short girl muscular only tall..no long hair very hard to maintain!,nice athelete she shld be,dominant girl be nice *starts blushing* very blah blah blah very talkative,black round glasses she shld have",
        images: ["https://videos.openai.com/vg-assets/assets%2Ftask_01jsnnz8gvf38t47ns38p1846z%2F1745558215_img_0.webp?st=2025-04-25T04%3A15%3A25Z&se=2025-05-01T05%3A15%3A25Z&sks=b&skt=2025-04-25T04%3A15%3A25Z&ske=2025-05-01T05%3A15%3A25Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=aa5ddad1-c91a-4f0a-9aca-e20682cc8969&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=fnT6Y6EVPT8uj%2Fql22bxSUmlC9afaczzAGG4eVLg0go%3D&az=oaivgprodscus"],
    },
];

const carouselImages = [
    "https://img.freepik.com/premium-vector/space-vintage-colorful-horizontal-poster_225004-2209.jpg",
    "https://img.freepik.com/premium-vector/vintage-space-travel-horizontal-poster_225004-2206.jpg",
    "https://img.freepik.com/premium-vector/space-exploration-adventure-vector-retro-poster_8071-45275.jpg",
];

const Lounge = () => {
    const [posts, setPosts] = useState(dummyPosts);
    const [newContent, setNewContent] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const handlePost = () => {
        if (newContent.trim() === "") return;
        const newPost = {
            id: Date.now(),
            username: dummyUser.username,
            course: dummyUser.course,
            profilePic: dummyUser.profilePic,
            hashtags: ["#new"],
            content: newContent,
            images: [],
        };
        setPosts([newPost, ...posts]);
        setNewContent("");
    };

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center py-6 px-4 sm:px-6 md:px-12 gap-6 bg-[#1a1a1a] min-h-screen">
                {/* Responsive Carousel */}
                <div className="w-full max-w-[2050px] h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] relative overflow-hidden rounded-2xl shadow-xl">
                    <div
                        className="flex transition-transform duration-1000 ease-in-out"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {carouselImages.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt={`Slide ${i + 1}`}
                                className="w-full h-full object-cover flex-shrink-0"
                            />
                        ))}
                    </div>
                </div>

                <AddpostBar />

                {/* Responsive Posts List */}
                <div className="flex flex-col gap-6 w-full max-w-[950px]">
                    {posts.map((post) => (
                        <Post
                            key={post.id}
                            username={post.username}
                            course={post.course}
                            profilePic={post.profilePic}
                            hashtags={post.hashtags}
                            content={post.content}
                            images={post.images}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Lounge;
