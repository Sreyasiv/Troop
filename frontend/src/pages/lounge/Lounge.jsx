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
        username: "Demo1",
        course: "BTECH-CSE_WIP",
        profilePic: "https://i.pravatar.cc/150?img=33",
        hashtags: ["#art", "#community"],
        content: "Hey Welcome to TROOP! Troop is a dynamic college community platform designed to connect students, support freelancers and businesses, share learning resources, and provide event updates.",
        images: []
    },
    {
        id: 2,
        username: "Demo2",
        course: "BTECH-CSE_WIP",
        profilePic: "https://i.pravatar.cc/150?img=45",
        hashtags: ["#code", "#react"],
        content: "A hew 24 hackathon at IIT MADRAS,interested students please DM no:9034567891",
        images: ["https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/002/261/268/datas/original.jpg"],
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
