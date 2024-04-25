import { useContext, useEffect, useState } from "react";
import PocketBaseContext from "./PocketBaseContext";
import Main from "./Main";
import Login from "./Login";
import CreatePost from "./CreatePost";
import Post from "./Post";
import Navbar from "./Navbar";

const Home = () => {
    const pb = useContext(PocketBaseContext);
    const [posts, setPosts] = useState([]);

    const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc condimentum dui vel nisl lacinia porttitor. Sed malesuada dui eget quam ullamcorper, porta lacinia velit tristique. Proin sit amet sem quam. Etiam bibendum risus sed leo semper, in malesuada odio finibus. Duis aliquam dignissim metus at fringilla. Mauris scelerisque laoreet ipsum a molestie. Aliquam vel mollis ipsum. Quisque ultricies commodo sem, at cursus quam viverra sit amet. Maecenas vel finibus arcu. Fusce magna ipsum, semper in lectus vel, imperdiet ullamcorper mi. Fusce blandit lacus eu tellus porta accumsan. Phasellus tempor odio ut pellentesque gravida. Donec tincidunt mi purus, sit amet blandit diam consectetur in. Praesent consectetur venenatis orci nec fermentum. Donec bibendum rutrum metus a tempus. Quisque tincidunt feugiat augue quis malesuada. Vivamus et porttitor libero, sed volutpat nibh. In hac habitasse platea dictumst. Vestibulum in risus porttitor, maximus magna at, feugiat magna. Maecenas semper enim nec fermentum tempor. Donec sollicitudin eleifend lacus, at molestie nisl semper sit amet. Donec tortor erat, vestibulum at magna ut, vestibulum maximus lectus. Suspendisse efficitur lorem arcu, quis elementum diam vestibulum sit amet. Nam laoreet sem sit amet luctus pellentesque. Nullam volutpat lacinia leo sit amet luctus. Maecenas vitae magna sollicitudin eros iaculis ultricies nec et dui. Quisque interdum, lectus finibus tincidunt congue, urna nulla malesuada erat, non semper neque risus vel dolor. Integer sit amet ex non purus pharetra imperdiet quis non nibh. Morbi cursus elementum fringilla. In vitae gravida libero, vitae auctor sapien. Sed vitae varius erat. Sed at molestie nibh, a congue.";

    async function fetchPosts(startPost, endPost) {
        // fetch a paginated records list
        // Filter out comments aka no parent_post
        const resultList = await pb.collection('posts').getList(startPost, endPost, { requestKey: null, sort: '-created', filter: `parent_post=null`, expand: `likes_via_liked_post, user_created`});
        
        const updatedPosts = resultList.items.map(function(post) {
            // Modify the image property for each post
            // If there is an expand property, the post has likes
            let likes = ('likes_via_liked_post' in post.expand) ? post.expand.likes_via_liked_post.length : 0;
            return { ...post, image: pb.files.getUrl(post, post.image), likes: likes};
        });
        
        setPosts([...posts, ...updatedPosts]);

        let resultPosts = [...posts, ...updatedPosts];
        setPosts(resultPosts);
    }

    useEffect(() => {
        fetchPosts(1, 5);
    }, []);

    return (  
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 py-5">
            <Navbar />
            <div className="flex flex-col justify-center items-center gap-3">
                <CreatePost />
                {posts.map((post) => (
                    <Post post={post}/>
                ))}
            </div>
            <div>

            </div>
        </div>
    );
}
 
export default Home;