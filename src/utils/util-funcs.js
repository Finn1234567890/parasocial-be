function calcTimeDiff(timestamp, format) {
  if (format === "iso") {
    const pastDate = new Date(timestamp);

    const currentTime = new Date();

    return currentTime - pastDate;
  }
  if (format === "milli") {
    const timeInMilliseconds = timestamp * 1000;

    const currentTime = Date.now();

    return currentTime - timeInMilliseconds;
  }
}

function calcTimeAgo(timestamp, format) {
  const timeDifference = calcTimeDiff(timestamp, format);

  const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));

  if (hoursAgo < 12) {
    return `${hoursAgo} hours ago`;
  } else if (hoursAgo < 24) {
    return `1 day ago`;
  } else if (hoursAgo === 0) {
    return "Just now";
  } else {
    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo} days ago`;
  }
}

module.exports = { calcTimeAgo }