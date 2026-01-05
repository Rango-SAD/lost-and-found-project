package controller.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import service.entity.ItemCategory;
import service.entity.ItemStatus;
import service.entity.ItemTag;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemResponse {
    private Long id;
    private String title;
    private String description;
    private ItemStatus status;
    private ItemCategory category;
    private ItemTag tag;
    private String location;
    private Long userId;
    private String userName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

