const welcome = (req, res) => {
  return res.status(200).json({ greet: "welcomer user" })
}

export default welcome;