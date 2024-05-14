import React, { useEffect, useState } from 'react';
import './Row.css';
import axios from '../../axios';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

import one from '../../assets/img/1.png'
import two from '../../assets/img/2.jpg'
import three from '../../assets/img/3.jpg'
import four from '../../assets/img/4.jpeg'
import five from '../../assets/img/5.jpg'
import six from '../../assets/img/6.jpg'
import seven from '../../assets/img/7.png'
import eight from '../../assets/img/8.jpg'

const my_movies = [
  {id:1, image:one, name:'guy'},
  {id:2, image:two, name:'apes'},
  {id:3, image:three, name:'balloon'},
  {id:4, image:four, name:'rare_apes'},
  {id:5, image:five, name:'man'},
  {id:6, image:six, name:'chill'},
  {id:7, image:seven, name:'zombie'},
  {id:8, image:eight, name:'sss'},
]




const baseUrl = "https://image.tmdb.org/t/p/original/";

const opts = {
  height: "370px",
  playerVars: {
    autoplay: 1,
  },
};

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [showTrailerNotFound, setShowTrailerNotFound] = useState(false);
  const [playingIndex, setPlayingIndex] = useState(null);

  // Fetch movie data when the component mounts or fetchUrl changes
  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results);
        console.log(request.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [fetchUrl]);

  // Handle click on a movie poster to show its trailer
  const handleClick = (movie, index) => {
    if (playingIndex !== null) {
      setTrailerUrl("");
      setPlayingIndex(null);
    }

    if (playingIndex !== index) {
      setPlayingIndex(index);

      // Find and set the YouTube trailer URL for the selected movie
      movieTrailer(movie?.name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get('v'));
          setShowTrailerNotFound(false);
        })
        .catch(() => {
          // If the trailer is not found, show a message for a short time
          setTrailerUrl("");
          setShowTrailerNotFound(true);
          setTimeout(() => {
            setShowTrailerNotFound(false);
          }, 1000);
        });
    }
  };

  // Handle click on "Cut Trailer" button to stop and hide the trailer
  const handleCutTrailer = () => {
    setTrailerUrl("");
    setPlayingIndex(null);
  };

  const youtubeContainerKey = trailerUrl ? `youtube-${trailerUrl}` : 'youtube';

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {my_movies?.map((movie, index) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie, index)}
            className={`row__poster  ${isLargeRow && "row__posterLarge"} `}
            src={movie.image}
            alt={movie.name}
          />
        ))}
      </div>
      <div className='trailerUrl-container'>
        {trailerUrl ? (
          // Wrap the YouTube component in a container with a unique key
          <div key={youtubeContainerKey}>
            <YouTube
              videoId={trailerUrl}
              opts={opts}
              className='youtube'
            />
            <button
              className="cutButton"
              onClick={handleCutTrailer}
            >
              Cut Trailer
            </button>
          </div>
        ) : (
          <div id='not-found'>
            {showTrailerNotFound && (
              <h3>
                Trailer not found
              </h3>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Row;
