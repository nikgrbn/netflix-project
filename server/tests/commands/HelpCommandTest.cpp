#include "commands/HelpCommand.h"
#include "commands/AddCommand.h"
#include "commands/RecommendCommand.h"
#include "commands/PatchCommand.h"
#include "commands/DeleteCommand.h"
#include <gtest/gtest.h>
#include <string>
#include <map>

using namespace std;

TEST(HelpCommandTest, CheckHelpOutput) {
   
    map<string, ICommand*> commands;
    commands["POST"] = new AddCommand(nullptr);
    commands["GET"] = new RecommendCommand(nullptr);
    commands["PATCH"] = new PatchCommand(nullptr);
    commands["DELETE"] = new DeleteCommand(nullptr);
    commands["help"] = new HelpCommand(commands);

  
    string expectedOutput =
        "DELETE, arguments: [userid] [movieid1] [movieid2] …\n"
        "GET, arguments: [userid] [movieid]\n"
        "PATCH, arguments: [userid] [movieid1] [movieid2] …\n"
        "POST, arguments: [userid] [movieid1] [movieid2] …\n"
        "help";

 
    HelpCommand helpCommand(commands);
    string actualOutput = helpCommand.execute({"help"});

    EXPECT_EQ(actualOutput, expectedOutput);


    for (auto& command : commands) {
        delete command.second;
    }
}
