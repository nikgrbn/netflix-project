package com.example.androidapp.ui;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

public class NavigationHelper {

    private final FragmentManager fragmentManager;
    private final int containerId;

    public NavigationHelper(FragmentManager fragmentManager, int containerId) {
        this.fragmentManager = fragmentManager;
        this.containerId = containerId;
    }

    public void openFragment(Fragment fragment, Bundle args, boolean addToBackStack) {
        if (args != null) {
            fragment.setArguments(args);
        }

        var transaction = fragmentManager.beginTransaction()
                .replace(containerId, fragment);

        if (addToBackStack) {
            transaction.addToBackStack(null);
        }

        transaction.commit();
    }

    public void openMovieInfoFragment(int movieId) {
        MovieInfoFragment fragment = new MovieInfoFragment();
        Bundle args = new Bundle();
        args.putInt("movieId", movieId);

        openFragment(fragment, args, true);
    }

    public void openAnotherFragment(Fragment fragment) {
        openFragment(fragment, null, true);
    }
}
