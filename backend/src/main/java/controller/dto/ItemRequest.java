package controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import service.entity.ItemCategory;
import service.entity.ItemStatus;
import service.entity.ItemTag;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @NotNull(message = "Status is required")
    private ItemStatus status;

    @NotNull(message = "Category is required")
    private ItemCategory category;

    @NotNull(message = "Tag is required")
    private ItemTag tag;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;
}
