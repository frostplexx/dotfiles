-- [[ Keymaps that (re)map vim functions ]]
vim.g.mapleader = " "
vim.g.maplocalleader = " "

vim.keymap.set("n", "<leader>q", ":wqa<cr>", { desc = "Quit", silent = true })
vim.keymap.set("n", "<leader>Q", ":qa!<cr>", { desc = "Quit without saving", silent = true })

-- remap redo to U
vim.keymap.set("n", "U", "<C-r>", { desc = "Redo", noremap = false })

-- scratchpad
vim.keymap.set("n", "sc", ":lua require('scratch').toggle()<cr>", { desc = "Scratchpad", silent = true })

-- Undotree
vim.keymap.set("n", "<leader>cu", vim.cmd.UndotreeToggle, { desc = "Toggle Undotree" })

-- Lazygit
vim.keymap.set("n", "<leader>gg", ":terminal lazygit <cr> i", { desc = "Lazygit" })

vim.keymap.set("n", "<leader>gb", ":!git blame -c -- % <cr>", { desc = "Git blame" })

-- Ctrl-a to select all
vim.keymap.set("n", "<C-a>", "ggVG", { desc = "Select all" })

-- Rearrange visually selected lines in normal mode
vim.keymap.set("n", "<C-d>", "<C-d>zz")

-- Scroll up half a screen in normal mode, keeping the cursor in the same position
vim.keymap.set("n", "<C-u>", "<C-u>zz")

-- Move to the next search result and center the screen
vim.keymap.set("n", "n", "nzzzv")

-- Move to the previous search result and center the screen
vim.keymap.set("n", "N", "Nzzzv")

-- Delete selected text in visual mode and paste it at the cursor position
vim.keymap.set("x", "<leader>p", [["_dP]])

-- Delete selected text in normal and visual mode without affecting the system clipboard
vim.keymap.set({ "n", "v" }, "<leader>d", [["_d]])

-- Search and replace in the whole file with confirmation, case-insensitive, and whole-word
vim.keymap.set("n", "<leader>s", [[:%s/\<<C-r><C-w>\>/<C-r><C-w>/gI<Left><Left><Left>]])
