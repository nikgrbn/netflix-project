#include "commands/HelpCommand.h"
#include <gtest/gtest.h>

// Check info method
TEST(HelpCommandTest, CheckInfo) {
    EXPECT_EQ(HelpCommand(map<string, ICommand*>()).info(), "help");
}
