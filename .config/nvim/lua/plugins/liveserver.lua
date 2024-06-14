return {
    "barrett-ruth/live-server.nvim",
    lazy = true,
    event = "BufEnter *.html",
    build = "npm install -g live-server",
    config = function()
        require("live-server").setup()
    end,
}
