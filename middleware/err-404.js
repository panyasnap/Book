module.exports = (req, res) => {
    res.status(404)
    let errm = {
        errcode: 404,
        errmsg: 'страница не найдена'
    }
    res.json(errm)
}