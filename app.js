const express = require("express"); // Importando express
const movies = require("./movies.json"); // Importando movies.json
const crypto = require("node:crypto"); // es necesario importar crypto para 
const { validateMovie, validatePartialMovie } = require("./schemas/movies");
const cors = require("cors");

const app = express();
app.disable (`x-powered-by`); // Deshabilitando el header x-powered-by (es una buena practica)

app.use(express.json()); // para que express pueda entender el body de la peticion
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
            "http://localhost:5500",
            "http://127.0.0.1:5500",
            "http://localhost:3000"
        ]
        
        if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));


app.get("/", (req, res) => {
    res.json({
        message: `Hello World`
    });
});

//todos los recursos que sean movies se identifican por la ruta /movies
app.get("/movies", (req, res) => {

    const { genre } = req.query;
    if (genre) {
        const moviesByGenre = movies.filter(movie => movie.genre.includes(genre));
        if (moviesByGenre.length === 0) return res.status(404).json({ message: "Genre not found" });
        return res.json(moviesByGenre);
    }
    res.json(movies);
})

app.get("/movies/:id", (req, res) => { //path-to-regaxp
    const { id } = req.params;
    const movie = movies.find(movie => movie.id === id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    return res.json(movie); 
})


app.post ("/movies", (req, res) => {

    const result = validateMovie(req.body);

    if (result.error) {
        //422 Unprocessable Entity 
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    // en base de datos. pendiente de la siguiente clase
    const newMovie = {
        id: crypto.randomUUID(), // uuid v4
        ...result.data // validado. no es req.body
    }

    movies.push(newMovie); // esto deja de ser rest

    res.status(201).json(newMovie);
})



app.delete("/movies/:id", (req, res) => {
    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);
    
    if (movieIndex === -1) {
        return res.status(404).json({ message: "Movie not found" });
    }
    
    movies.splice(movieIndex, 1);
    
    return res.status(200).json({message: "Movie deleted"});
})


app.patch("/movies/:id", (req, res) => {
    const result = (validatePartialMovie(req.body));
    
    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }

    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);
    
    if (movieIndex === -1) {
        return res.status(404).json({ message: "Movie not found" });
    } 
    
    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updateMovie;

    res.json(updateMovie);
})



// server
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});




/*
cors a pie

// opcion 1
//aceptar todo lo que venga. (*)

//opcion 2
//aceptar solo los orignes que esten en la lista

const ACCEPTED_ORIGINS = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000"
]

//luego en cada ruda vaidad el origen 
// funcional para lo siples
    // metodos normales: GET, HEAD, POST

// pero se añade otra capa de complejisdad para los modificadores
    // metodos de complejos: PUT, PATH, DELETE
    // CORS PRE-Flight: OPTIONS (requieres options)


// const origin = req.header("origin");
//if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//    res.header("Access-Control-Allow-Origin", origin);
//}

// trndrias que añadir la ruta de app.options (
//CORS PRE-FLIGHT
app.options("/movies/:id", (req, res) => {
    const origin = req.header("origin");

    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE"); //metodos permitidos
    }
    res.send(200);
})
)
// para definir los metodos y cabezeras aceptadas 
// en esta ruta tambien validad el origen


// cors con middleware

app.use(cors());



*/