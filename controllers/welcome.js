const welcome = (req, res) => {
  return res.status(200).json({ lastCommit: "oAuth update 23/5/2025" })
}

export default welcome;