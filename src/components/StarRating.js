import { useState } from "react";
import PropTypes from "prop-types";

const starContainerStyles = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
};

const ListStarStyles = {
  display: "flex",
  gap: ".1rem",
};

StarRating.propTypes = {
  maxRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  messages: PropTypes.array,
  defaultRating: PropTypes.number,
  onSetRating: PropTypes.func,
  disabled: PropTypes.bool, // Tambahkan prop disabled
};

function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 24,
  messages = [],
  defaultRating = 0,
  onSetRating,
  disabled = false, // Set default value for disabled
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  const handleTempRating = (rating) => {
    if (!disabled) {
      // Cek apakah disabled
      setTempRating(rating);
      setRating(0);
    }
  };

  const handleRating = (rate) => {
    if (!disabled) {
      // Cek apakah disabled
      setRating(rate);
      setTempRating(0);
      onSetRating(rate);
    }
  };

  const textStarStyles = {
    fontSize: `${size}px`,
    color,
    lineHeight: "0",
    margin: "0",
  };

  return (
    <div style={starContainerStyles}>
      <div style={ListStarStyles}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            color={color}
            size={size}
            key={i + 1}
            onRate={() => handleRating(i + 1)}
            onHoverIn={() => handleTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
            full={rating >= i + 1 || tempRating >= i + 1}
            disabled={disabled} // Pass disabled prop to Star
          />
        ))}
      </div>
      <p style={textStarStyles}>
        {messages.length === maxRating
          ? messages[rating > 0 ? rating - 1 : tempRating - 1]
          : rating > 0
          ? rating
          : tempRating}
      </p>
    </div>
  );
}

function Star({ onRate, full, onHoverIn, onHoverOut, color, size, disabled }) {
  const starStyles = {
    width: `${size}px`,
    height: `${size}px`,
    cursor: disabled ? "not-allowed" : "pointer", // Ganti cursor saat disabled
    opacity: disabled ? 0.5 : 1, // Kurangi opacity saat disabled
  };

  return (
    <span
      role="button"
      onClick={disabled ? undefined : onRate} // Jangan panggil onRate jika disabled
      style={starStyles}
      onMouseEnter={disabled ? undefined : onHoverIn} // Jangan panggil onHoverIn jika disabled
      onMouseLeave={disabled ? undefined : onHoverOut} // Jangan panggil onHoverOut jika disabled
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </span>
  );
}

export default StarRating;
