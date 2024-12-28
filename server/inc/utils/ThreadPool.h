
#ifndef NETFLIXPROJECT_THREADPOOL_H
#define NETFLIXPROJECT_THREADPOOL_H

#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>
#include <future>
#include <stdexcept>

class ThreadPool {
public:
    explicit ThreadPool(size_t threadCount);
    ~ThreadPool();

    void enqueue(std::function<void()> task);

private:
    // Keep track of threads so we can join them
    std::vector<std::thread> workers;
    // The task queue
    std::queue<std::function<void()>> tasks;

    // Mutex to synchronize access to shared data
    std::mutex queueMutex;

    // Condition variable to signal changes in the state of
    // the tasks queue
    std::condition_variable condition;

    // Flag to indicate whether the thread pool should stop
    // or not
    std::atomic<bool> stop;

    void worker();
};


#endif //NETFLIXPROJECT_THREADPOOL_H
