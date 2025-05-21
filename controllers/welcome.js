const welcome = (req, res) => {
  return res.status(200).json({ greet: "welcomer to the api >> Administrative world 👋" })
}

export default welcome;