package com.example.androidapp.adapters;


import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.example.androidapp.R;
import com.example.androidapp.data.model.entity.Category;

import java.util.List;

public class CategoryAdapter extends RecyclerView.Adapter<CategoryAdapter.CategoryViewHolder> {
    private List<Category> categories;
    private MovieClickHandler clickHandler; // Add the click handler

    public CategoryAdapter(List<Category> categories, MovieClickHandler clickHandler) {
        this.categories = categories;
        this.clickHandler = clickHandler;
    }

    public void setCategories(List<Category> newCategories) {
        this.categories = newCategories;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public CategoryViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_category, parent, false);
        return new CategoryViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CategoryViewHolder holder, int position) {
        Category category = categories.get(position);
        holder.tvCategoryName.setText(category.getName());

        // Set up the movie RecyclerView
        holder.rvMovies.setLayoutManager(
                new LinearLayoutManager(holder.rvMovies.getContext(), LinearLayoutManager.HORIZONTAL, false)
        );

        // Pass the click handler to the MovieAdapter
        MovieAdapter movieAdapter = new MovieAdapter(category.getMovies(), clickHandler);
        holder.rvMovies.setAdapter(movieAdapter);
    }

    @Override
    public int getItemCount() {
        return categories != null ? categories.size() : 0;
    }

    public static class CategoryViewHolder extends RecyclerView.ViewHolder {
        TextView tvCategoryName;
        RecyclerView rvMovies;

        public CategoryViewHolder(@NonNull View itemView) {
            super(itemView);
            tvCategoryName = itemView.findViewById(R.id.tvCategoryName);
            rvMovies = itemView.findViewById(R.id.rvMovies);
        }
    }
}
