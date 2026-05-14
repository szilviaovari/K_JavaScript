import express, { json } from "express";
import * as db from "./data/db.js";

const PORT = 3080;
const app = express();

app.use(express.json());

app.get("/posts", (req,res) =>{
    const posts = db.getAllPosts();
    res.status(200).json(posts);
});

app.get("/posts/:id", (req,res) => {
    const id = +req.params.id;
    const post = db.getPostById(id);
    if(!post)
    {
        return res.status(404).json({message: "Poszt nem található"});
    }
    res.status(200).json(post);
})

app.post("/posts", (req,res) => {
    const {title,content} = req.body;
    if((!title) || (!content))
    {
        return res.status(400).json({message: "Poszt adat hiány"});
    }
    const saved = db.savePost(title,content);
    res.status(201).json({id: saved.lastInsertRowId, title, content});
})

app.delete("/posts/:id", (req,res) => {
    const id = +req.params.id;
    const post = db.getPostById(id);
    if(!post)
    {
        return res.status(404).json({message: "Poszt nem található"});
    }
    db.deletePost(id);
    res.status(204).json("No content");
})

app.listen(PORT, () => console.log(`Server runs on ${PORT}`));
