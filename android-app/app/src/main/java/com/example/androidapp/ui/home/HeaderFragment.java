package com.example.androidapp.ui.home;

import android.content.Context;
import android.content.Intent;
import android.graphics.Rect;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.PopupWindow;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.example.androidapp.MyApplication;
import com.example.androidapp.R;
import com.example.androidapp.db.AppDatabase;
import com.example.androidapp.ui.ConsoleActivity;
import com.example.androidapp.ui.LandingActivity;
import com.example.androidapp.viewmodel.home.BannerViewModel;
import com.example.androidapp.viewmodel.home.HeaderViewModel;
import com.example.androidapp.viewmodel.home.ViewModelFactory;

public class HeaderFragment extends Fragment {

    private EditText etSearch;
    private ImageView ivProfile;
    private TextView tvUsername;
    private HeaderListener listener;
    private boolean isAdmin;

    public interface HeaderListener {
        void onSearchQueryChanged(String query);
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (context instanceof HeaderListener) {
            listener = (HeaderListener) context;
        } else {
            //throw new RuntimeException(context.toString() + " must implement HeaderListener");
        }
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_header, container, false);

        // Initialize ViewModel
        HeaderViewModel headerViewModel = new ViewModelProvider(this,
                new ViewModelFactory(((MyApplication) requireActivity().getApplication()).getMovieRepository())
        ).get(HeaderViewModel.class);

        etSearch = view.findViewById(R.id.etSearch);
        ivProfile = view.findViewById(R.id.ivProfile);
        tvUsername = view.findViewById(R.id.tvUsername);

        // Handle clicks outside of EditText to clear focus
        setGlobalTouchListener(view);

        headerViewModel.getUser().observe(getViewLifecycleOwner(), user -> {
            if (user != null) {
                // Update the UI with the user's information
                tvUsername.setText(user.getDisplayName());

                // Load the user's profile picture
                Glide.with(this)
                        .load(user.getPicture())
                        .into(ivProfile);

                isAdmin = user.isAdmin();
            }
        });

        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                if (listener != null) {
                    listener.onSearchQueryChanged(s.toString());
                }
            }

            @Override
            public void afterTextChanged(Editable s) {}
        });

        // Handle profile image click
        ivProfile.setOnClickListener(v -> {
            // Inflate the popup layout
            View popupView = LayoutInflater.from(requireContext()).inflate(R.layout.popup_menu, null);

            // Create the PopupWindow
            PopupWindow popupWindow = new PopupWindow(popupView, ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT, true);

            // Find buttons inside the popup layout
            Button btnCategories = popupView.findViewById(R.id.btnCategories);
            Button btnLogout = popupView.findViewById(R.id.btnLogout);
            Button btnConsole = popupView.findViewById(R.id.btnConsole);

            // Show or hide the console button based on the user's role
            if (isAdmin) {
                // Show the console button
                btnConsole.setVisibility(View.VISIBLE);
            } else {
                // Hide the console button
                btnConsole.setVisibility(View.GONE);
            }

            // Set click listeners for the buttons
            btnCategories.setOnClickListener(buttonView -> {
                // Handle Categories button click
                popupWindow.dismiss();
            });

            btnLogout.setOnClickListener(buttonView -> {
                // Handle Logout button click
                // Clear the database
                AppDatabase.getInstance(requireActivity().getApplicationContext()).clearAllData(); // Use requireActivity().getApplicationContext() for context

                // Navigate to LandingActivity
                Intent intent = new Intent(requireActivity(), LandingActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);

                // Finish the current activity
                requireActivity().finish();
            });

            btnConsole.setOnClickListener(buttonView -> {
                // Handle Console button click
                Intent intent = new Intent(requireActivity(), ConsoleActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
            });

            // Show the popup window anchored to the profile image
            popupWindow.showAsDropDown(ivProfile, -100, 0); // Adjust the offset as needed
        });


        return view;
    }

    private void setGlobalTouchListener(View fragmentView) {
        View decorView = requireActivity().getWindow().getDecorView();
        decorView.setOnTouchListener((v, event) -> {
            if (event.getAction() == MotionEvent.ACTION_DOWN) {
                if (etSearch.isFocused()) {
                    Rect outRect = new Rect();
                    etSearch.getGlobalVisibleRect(outRect);
                    if (!outRect.contains((int) event.getRawX(), (int) event.getRawY())) {
                        etSearch.clearFocus();
                    }
                }
            }
            return false;
        });
    }
}