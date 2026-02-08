const z = require("zod"); // importa zod: validador de esquemas

const movieSchema = z.object({
    title : z.string({
        invalid_type_error: "El titulo debe ser un string",
        required_error: "El titulo es requerido"
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().max(300),
    rate: z.number().min(0).max(5).default(0),
    poster: z.string().url({
        message: "Poster debe ser una url"
    }),
    genre: z.array(z.enum(["Drama", "Comedy", "Action", "Horror", "Animation", "Sci-Fi", "Thriller", "Romance", "Crime", "Adventure", "Fantasy", "Mystery", "Biography", "History", "War", "Music", "Family", "Sport", "Documentary", "Reality", "Game"]))
})

function validateMovie (object){
    return movieSchema.safeParse(object);
}

function validatePartialMovie (object){
    return movieSchema.partial().safeParse(object); //partial: valida el esquema y devuelve un objeto con dos propiedades: success y data
    //valida que el objeto tenga al menos una propiedad
}


//safeParse: valida el esquema y devuelve un objeto con dos propiedades: success y data
//parse: valida el esquema y devuelve un objeto con dos propiedades: success y data

// safeParse async

module.exports = {
    validateMovie,
    validatePartialMovie 
}
