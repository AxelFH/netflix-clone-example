import React, { useEffect, useState } from 'react';
import './Banner.css';
import axios from '../../axios';
import requests from '../../request';
import movieTrailer from 'movie-trailer';
import YouTube from 'react-youtube';

import poke from '../../assets/img/poke.jpeg'

function Banner() {
  const [movie, setMovie] = useState([]);
  const [trailerurl, setTrailerurl] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);

      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length)
        ]
      );
    }

    fetchData();
  }, []);

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }

  const handleClick = (movie) => {
    if (trailerurl) {
      setTrailerurl("");
    } else {
      movieTrailer(movie?.name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerurl(urlParams.get('v'));
        })
        .catch((error) => console.log(error));
    }
  };

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div>
      <header
        className="banner"
        onClick={() => setTrailerurl("")}
        style={{
          backgroundSize: "cover",
          backgroundImage: `url(
            "${poke}"
          )`,
          backgroundPosition: "center center",
        }}
      >
        <div className="banner__contents">
          <h1 className="banner__title">
            Pokegochi
          </h1>
          <div className="banner__buttons">
            <button onClick={() => handleClick(movie)} className="banner__button">
              Play
            </button>
            <button className="banner__button">My List</button>
          </div>
          <h1 className="banner__description">NFT + MEMECOIN GAME</h1>
        </div>
        <div className="banner--fadeBottom" />
      </header>
      {trailerurl && <YouTube videoId={trailerurl} opts={opts} />}
    </div>
  );
}

export default Banner;