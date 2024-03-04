import React, { useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { styled } from "@mui/material/styles";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

function Blocks() {
  const boxRef = useRef(null);
  const [movingBlocks, setMovingBlocks] = useState([
    {
      id: 1,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      backgroundColor: "red",
      offsetX: 1,
      offsetY: 1,
    },
  ]);
  const [boxSize, setBoxSize] = useState({ width: 50, height: 50 });
  const [score, setScore] = useState(0);
  const [livesLeft, setLivesLeft] = useState(3);

  const handleBoxClick = (e) => {
    const box = boxRef.current.getBoundingClientRect();
    setScore(score + 1);
    setMovingBlocks((prevB) => [
      ...prevB,
      {
        id: Date.now(),
        width: Math.floor(Math.random() * 50 + 50),
        height: Math.floor(Math.random() * 50 + 50),
        x: Math.floor(Math.random() * box.width),
        y: Math.floor(Math.random() * box.height),
        backgroundColor: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)})`,
        offsetX: Math.floor(Math.random() * 2 + 1),
        offsetY: Math.floor(Math.random() * 3),
      },
    ]);
  };

  useEffect(() => {
    const boxRect = boxRef.current.getBoundingClientRect();

    setBoxSize({
      width: boxRect.width,
      height: boxRect.height,
    });
  }, []);

  useEffect(() => {
    const animateBlocks = () => {
      setMovingBlocks((prevBlocks) =>
        prevBlocks.map((block) => {
          let offsetXFlag = false;
          let offsetYFlag = false;

          if (
            block.x + block.offsetX > boxSize.width - block.width ||
            block.x + block.offsetX <= 0
          )
            offsetXFlag = true;
          if (
            block.y + block.offsetY > boxSize.height - block.height ||
            block.y + block.offsetY <= 0
          )
            offsetYFlag = true;

          return {
            ...block,
            offsetX: offsetXFlag ? block.offsetX * -1 : block.offsetX,
            offsetY: offsetYFlag ? block.offsetY * -1 : block.offsetY,
            x: block.x + block.offsetX,
            y: block.y + block.offsetY,
          };
        })
      );
    };

    requestAnimationFrame(animateBlocks);
  }, [movingBlocks]);

  const handleBlockClick = (e) => {
    e.stopPropagation();

    if (livesLeft <= 1) {
      setMovingBlocks([]);
      setLivesLeft(3);
      setScore(0);
      return (
        <Box className="absolute inset-0">
          <div>Game Over</div>
          <div>Score: {score}</div>
        </Box>
      );
    }

    setMovingBlocks((prevBlocks) =>
      prevBlocks.filter((block) => block.id !== Number(e.target.id))
    );
    setLivesLeft(livesLeft - 1);
  };

  return (
    <Box
      ref={boxRef}
      className="relative border w-full h-full bg-slate-400 overflow-hidden"
      onClick={handleBoxClick}
    >
      <Box className="flex justify-between p-4">
        <div className="flex gap-1">
          Lives:{" "}
          <StyledRating
            readOnly
            value={livesLeft}
            max={3}
            icon={<FavoriteIcon fontSize="inherit" />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
          />
        </div>
        <div>Score: {score}</div>
      </Box>
      {movingBlocks.map((block, index) => (
        <Box
          key={block.id}
          id={block.id}
          className={`absolute rounded-2xl p-4 flex items-center justify-center cursor-pointer`}
          style={{
            left: `${block.x}px`,
            top: `${block.y}px`,
            width: `${block.width}px`,
            height: `${block.height}px`,
            backgroundColor: block.backgroundColor,
          }}
          onClick={handleBlockClick}
        >
          {`${index}`}
        </Box>
      ))}
    </Box>
  );
}

export default Blocks;
