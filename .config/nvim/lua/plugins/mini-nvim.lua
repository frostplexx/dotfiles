return {
    "echasnovski/mini.nvim",
    version = false,
    lazy = true,
    event = "BufReadPost",
    enabled = true,
    dependencies = {
        { "lewis6991/gitsigns.nvim" },
    },
    config = function()
        -- [[ Gitsigns ]]]
        require("gitsigns").setup()

        -- [[ Mini Cursorword ]]
        require("mini.cursorword").setup({})

        -- [[ Mini Indetenscope ]]
        require("mini.indentscope").setup({
            -- Draw options
            draw = {
                -- Delay (in ms) between event and start of drawing scope indicator
                delay = 0,
                animation = require("mini.indentscope").gen_animation.none(),
            },

            -- Module mappings. Use `''` (empty string) to disable one.
            mappings = {
                -- Textobjects
                object_scope = "ii",
                object_scope_with_border = "ai",

                -- Motions (jump to respective border line; if not present - body line)
                goto_top = "[i",
                goto_bottom = "]i",
            },

            -- Options which control scope computation
            options = {
                border = "both",
                indent_at_cursor = true,
                try_as_border = false,
            },
            symbol = "│",
        })

        -- [[ Mini Files ]]
        require("mini.files").setup(
        -- No need to copy this inside `setup()`. Will be used automatically.
            {
                content = {
                    filter = nil,
                    prefix = nil,
                    sort = nil,
                },
                mappings = {
                    close = "q",
                    go_in_plus = "<cr>",
                    go_out = "h",
                    go_out_plus = "H",
                    reset = "<BS>",
                    reveal_cwd = "@",
                    show_help = "g?",
                    synchronize = "=",
                    trim_left = "<",
                    trim_right = ">",
                },
                options = {
                    permanent_delete = false,
                    use_as_default_explorer = true,
                },

                -- Customization of explorer windows
                windows = {
                    -- Maximum number of windows to show side by side
                    max_number = math.huge,
                    -- Whether to show preview of file/directory under cursor
                    preview = true,
                    -- Width of focused window
                    width_focus = 50,
                    -- Width of non-focused window
                    width_nofocus = 10,
                    -- Width of preview window
                    width_preview = 25,
                },
            }
        )

        -- [[ Mini Pairs ]]
        require("mini.pairs").setup()

        -- [[ Mini Surround ]]
        require("mini.surround").setup()

        local statusline = function()
            local mini = require("mini.statusline")

            local mode, mode_hl = mini.section_mode({ trunc_width = 9999 })
            local git = mini.section_git({ trunc_width = 75 })
            local diagnostics = mini.section_diagnostics({ trunc_width = 75 })
            local filename = mini.section_filename({ trunc_width = 140 })
            local fileinfo = mini.section_fileinfo({ trunc_width = 9999 })
            local location = mini.section_location({ trunc_width = 9999 })
            local search = mini.section_searchcount({ trunc_width = 0 })
            local diff = mini.section_diff({ trunc_width = 0 })

            local function show_macro_recording()
                local recording_register = vim.fn.reg_recording()
                if recording_register == "" then
                    return ""
                else
                    return "Recording @" .. recording_register
                end
            end


            return mini.combine_groups({
                { hl = mode_hl,                 strings = { mode } },
                { hl = "MiniStatuslineDevinfo", strings = { git, diff, diagnostics } },
                "%<", -- truncate point
                { hl = "MiniStatuslineFileinfo", strings = { show_macro_recording() } },
                { hl = "MiniStatuslineLocation", strings = { filename } },
                "%=", -- end left alignment
                { hl = "MiniStatuslineLocation", strings = { search, location } },
                { hl = mode_hl,                  strings = { fileinfo } },
            })
        end

        local inactive = function()
            local mini = require("mini.statusline")
            local filename = mini.section_filename({ trunc_width = 140 })
            local fileinfo = mini.section_fileinfo({ trunc_width = 9999 })
            return mini.combine_groups({
                { hl = "MiniStatuslineLocation", strings = { filename } },
                "%=", -- end left alignment
                { hl = "MiniStatuslineLocation", strings = { fileinfo } },
            })
        end

        -- [[ Mini Statusline ]]
        require("mini.statusline").setup(
        -- No need to copy this inside `setup()`. Will be used automatically.
            {
                content = {
                    active = statusline,
                    inactive = inactive,
                },
                use_icons = true,
                set_vim_settings = true,
            }
        )
    end,
    keys = {
        -- stylua: ignore
        { "<leader>bD", function() require("mini.bufremove").delete(0, true) end, desc = "Delete Buffer (Force)" },
        {
            "<leader>e",
            ":lua MiniFiles.open()<cr>",
            desc = "Show Files",
            silent = true,
        },
    },
}
