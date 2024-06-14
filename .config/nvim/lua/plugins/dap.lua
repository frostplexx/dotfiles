return {
    "rcarriga/nvim-dap-ui",
    lazy = true,
    dependencies = {
        'mfussenegger/nvim-dap',
        'theHamsta/nvim-dap-virtual-text',
    },
    config = function()
        local dap = require("dap")
        local xcodebuild = require("xcodebuild.dap")

        dap.configurations.swift = {
            {
                name = "iOS App Debugger",
                type = "codelldb",
                request = "attach",
                program = xcodebuild.get_program_path,
                -- alternatively, you can wait for the process manually
                -- pid = xcodebuild.wait_for_pid,
                cwd = "${workspaceFolder}",
                stopOnEntry = false,
                waitFor = true,
            },
        }

        dap.adapters.codelldb = {
            type = "server",
            port = "13000",
            executable = {
                -- set path to the downloaded codelldb
                -- sample path: "/Users/YOU/Downloads/codelldb-aarch64-darwin/extension/adapter/codelldb"
                command = "/Users/daniel/Documents/nvimExtras/codelldb/extension/adapter/codelldb",
                args = {
                    "--port",
                    "13000",
                    "--liblldb",
                    -- make sure that this path is correct on your side
                    "/Applications/Xcode.app/Contents/SharedFrameworks/LLDB.framework/Versions/A/LLDB",
                },
            },
        }
        require("dapui").setup()
        -- disables annoying warning that requires hitting enter
        local orig_notify = require("dap.utils").notify
        require("dap.utils").notify = function(msg, log_level)
            if not string.find(msg, "Either the adapter is slow") then
                orig_notify(msg, log_level)
            end
        end

        -- sample keymaps to debug application
        vim.keymap.set("n", "<leader>dx", xcodebuild.build_and_debug, { desc = "Build & Debug" })
        vim.keymap.set("n", "<leader>dr", xcodebuild.debug_without_build, { desc = "Debug Without Building" })
    end,
    keys = {
        { "<leader>dc", "<cmd>lua require'dap'.continue()<CR>",          desc = "Continue" },
        { "<leader>db", "<cmd>lua require'dap'.toggle_breakpoint()<CR>", desc = "Toggle Breakpoint" },
        { "<leader>dn", "<cmd>lua require'dap'.step_over()<CR>",         desc = "Step Over" },
        { "<leader>di", "<cmd>lua require'dap'.step_into()<CR>",         desc = "Step Into" },
        { "<leader>do", "<cmd>lua require'dap'.step_out()<CR>",          desc = "Step Out" },
        { "<leader>dd", "<cmd>lua require'dap'.down()<CR>",              desc = "Down" },
        { "<leader>ds", "<cmd>lua require'dap'.close()<CR>",             desc = "Stop" },
        { "<leader>dt", "<cmd>lua require'dapui'.toggle()<CR>",          desc = "Toggle Debug UI" },
        { "<leader>dv", "<cmd>lua require'dapui'.variables()<CR>",       desc = "Variables" },
        { "<leader>di", "<cmd>lua require'dapui'.inspector()<CR>",       desc = "Inspector" },
        { "<leader>dk", "<cmd>lua require'dapui'.hover()<CR>",           desc = "Hover" },
    }
}
