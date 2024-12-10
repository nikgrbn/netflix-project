#include <gtest/gtest.h>
#include "../inc/commands/DeleteCommand.h"
#include "../inc/data_manager/LocalDataManager.h"

// Check info method
TEST(DeleteCommandTest, CheckInfo) {
    IDataManager* dataManager = new LocalDataManager();
    EXPECT_EQ(DeleteCommand(dataManager).info(), "DELETE, arguments: [userid] [movieid1] [movieid2] …");
}