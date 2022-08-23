import pg from 'pg';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const { Pool } = pg;

const pool = new Pool({
    'user': 'postgres',
    'host': 'localhost',
    'database': 'movies',
    'password': '1234',
    'port': 5432
});


const app = express();
app.use(bodyParser.json());
app.use(cors());


app.post("/", async (req, res, next) => {
    console.log(req.body);

    const movie = req.body;
    const client = await pool.connect();
    const result = await client.query({
        text: `INSERT INTO movies 
        (title, genre, director, release_date, cover_image_url) 
        VALUES($1, $2, $3, $4, $5);`,
        values: [
            movie.title, 
            movie.genre, 
            movie.director,
            movie.release_date,
            movie.cover_image_url
        ]
    });

    res.send(`New movie with the title ${movie.title} created.`);
});

app.get("/", async (req, res, next) => {
    const client = await pool.connect();
    const result = await client.query({
        text: 'SELECT * FROM movies ORDER BY id DESC;',
    });

    res.json(result.rows);
});


app.put("/:id", async (req, res, next) => {
    const id = req.params.id;
    const movie = req.body;

    const client = await pool.connect();
    const result = await client.query({
        text: `UPDATE movies
        SET title = $1, genre = $2, director = $3,
        release_date = $4, cover_image_url = $5
        WHERE id = $6;`,
        values: [
            movie.title, 
            movie.genre, 
            movie.director, 
            movie.release_date, 
            movie.cover_image_url,
            id
        ]
    });

    res.send(`Movie with title: ${movie.title} updated in the database.`)
});



app.listen(4000, () => {
    console.log("Server started on port 4000");
})


