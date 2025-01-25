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
import android.widget.EditText;
import android.widget.ImageView;
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

        return view;
    }
}