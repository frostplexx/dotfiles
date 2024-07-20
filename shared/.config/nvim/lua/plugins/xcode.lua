return {
    "wojciech-kulik/xcodebuild.nvim",
    enabled = false,
    dependencies = {
        "nvim-telescope/telescope.nvim",
        "MunifTanjim/nui.nvim",
        "nvim-treesitter/nvim-treesitter",
    },

    keys = {
        -- Normal mode mappings
        n = {
            { "<leader>X",  "<cmd>XcodebuildPicker<cr>",                 { desc = "Show Xcodebuild Actions" } },
            { "<leader>xf", "<cmd>XcodebuildProjectManager<cr>",         { desc = "Show Project Manager Actions" } },
            { "<leader>xb", "<cmd>XcodebuildBuild<cr>",                  { desc = "Build Project" } },
            { "<leader>xB", "<cmd>XcodebuildBuildForTesting<cr>",        { desc = "Build For Testing" } },
            { "<leader>xr", "<cmd>XcodebuildBuildRun<cr>",               { desc = "Build & Run Project" } },
            { "<leader>xt", "<cmd>XcodebuildTest<cr>",                   { desc = "Run Tests" } },
            { "<leader>xT", "<cmd>XcodebuildTestClass<cr>",              { desc = "Run Current Test Class" } },
            { "<leader>x.", "<cmd>XcodebuildTestRepeat<cr>",             { desc = "Repeat Last Test Run" } },
            { "<leader>xl", "<cmd>XcodebuildToggleLogs<cr>",             { desc = "Toggle Xcodebuild Logs" } },
            { "<leader>xc", "<cmd>XcodebuildToggleCodeCoverage<cr>",     { desc = "Toggle Code Coverage" } },
            { "<leader>xC", "<cmd>XcodebuildShowCodeCoverageReport<cr>", { desc = "Show Code Coverage Report" } },
            { "<leader>xe", "<cmd>XcodebuildTestExplorerToggle<cr>",     { desc = "Toggle Test Explorer" } },
            { "<leader>xs", "<cmd>XcodebuildFailingSnapshots<cr>",       { desc = "Show Failing Snapshots" } },
            { "<leader>xd", "<cmd>XcodebuildSelectDevice<cr>",           { desc = "Select Device" } },
            { "<leader>xp", "<cmd>XcodebuildSelectTestPlan<cr>",         { desc = "Select Test Plan" } },
            { "<leader>xq", "<cmd>Telescope quickfix<cr>",               { desc = "Show QuickFix List" } },
            { "<leader>xx", "<cmd>XcodebuildQuickfixLine<cr>",           { desc = "Quickfix Line" } },
            { "<leader>xa", "<cmd>XcodebuildCodeActions<cr>",            { desc = "Show Code Actions" } },
        },
        -- Visual mode mappings
        v = {
            { "<leader>xt", "<cmd>XcodebuildTestSelected<cr>", { desc = "Run Selected Tests" } },
        },
    },
    config = function()
        require("xcodebuild").setup({
            -- put some options here or leave it empty to use default settings
        })
    end,
}
