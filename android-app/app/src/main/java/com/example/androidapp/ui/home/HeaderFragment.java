package com.example.androidapp.ui.home;

import android.content.Context;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.PopupWindow;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.example.androidapp.MyApplication;
import com.example.androidapp.R;
import com.example.androidapp.viewmodel.home.BannerViewModel;
import com.example.androidapp.viewmodel.home.HeaderViewModel;
import com.example.androidapp.viewmodel.home.ViewModelFactory;

public class HeaderFragment extends Fragment {

    private EditText etSearch;
    private ImageView ivProfile;
    private TextView tvUsername;

    private HeaderListener listener;

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
        HeaderViewModel bannerViewModel = new ViewModelProvider(this,
                new ViewModelFactory(((MyApplication) requireActivity().getApplication()).getMovieRepository())
        ).get(HeaderViewModel.class);

        etSearch = view.findViewById(R.id.etSearch);
        ivProfile = view.findViewById(R.id.ivProfile);
        tvUsername = view.findViewById(R.id.tvUsername);

        bannerViewModel.getUser().observe(getViewLifecycleOwner(), user -> {
            if (user != null) {
                // Update the UI with the user's information
                tvUsername.setText(user.getDisplayName());

                // Load the user's profile picture
                Glide.with(this)
                        .load(user.getPicture())
                        .into(ivProfile);
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

            // Set click listeners for the buttons
            btnCategories.setOnClickListener(buttonView -> {
                // Handle Categories button click
                popupWindow.dismiss();
            });

            btnLogout.setOnClickListener(buttonView -> {
                // Handle Logout button click
                popupWindow.dismiss();
            });

            btnConsole.setOnClickListener(buttonView -> {
                // Handle Console button click
                popupWindow.dismiss();
            });

            // Show the popup window anchored to the profile image
            popupWindow.showAsDropDown(ivProfile, -100, 0); // Adjust the offset as needed
        });


        return view;
    }
}