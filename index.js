import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;

const API_URL = process.env.API_URL || "https://api.lyrics.ovh/v1";

// Configuración para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de EJS como motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("index", { 
    lyrics: null,
    error: null
  });
});

app.post("/get-lyrics", async (req, res) => {
  const artist = req.body.artist;
  const song = req.body.song;
  try {
    const result = await axios.get(`${API_URL}/${artist}/${song}`);
    res.render("index", { 
      lyrics: result.data.lyrics,
      error: null
    });
  } catch (error) {
    res.render("index", { 
      lyrics: null,
      error: "No se pudo encontrar la letra de la canción. Por favor, revisa el nombre del artista y la canción."
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});