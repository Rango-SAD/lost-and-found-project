package service;

import controller.dto.ItemRequest;
import controller.dto.ItemResponse;
import exception.ItemNotFoundException;
import exception.UnauthorizedAccessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import service.entity.*;
import service.repository.ItemRepository;
import service.repository.ItemSpecification;
import service.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<ItemResponse> filterItems(
            Long itemId,
            ItemStatus status,
            ItemCategory category,
            ItemTag tag,
            Long userId,
            String keyword,
            int page,
            int size) {

        log.info("Filtering items with params - itemId: {}, status: {}, category: {}, tag: {}, userId: {}, keyword: {}, page: {}, size: {}",
                itemId, status, category, tag, userId, keyword, page, size);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Page<Item> items = itemRepository.findAll(
                ItemSpecification.filterItems(itemId, status, category, tag, userId, keyword),
                pageable
        );

        return items.map(this::mapToResponse);
    }


    @Transactional
    public ItemResponse createItem(ItemRequest request, Long userId) {
        log.info("Creating new item for user id: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ItemNotFoundException("User not found"));

        Item item = new Item();
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setStatus(request.getStatus());
        item.setCategory(request.getCategory());
        item.setTag(request.getTag());
        item.setLocation(request.getLocation());
        item.setUser(user);

        Item savedItem = itemRepository.save(item);
        log.info("Item created successfully with id: {}", savedItem.getId());

        return mapToResponse(savedItem);
    }

    @Transactional
    public ItemResponse updateItem(Long itemId, ItemRequest request, Long userId) {
        log.info("Updating item with id: {} by user id: {}", itemId, userId);

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + itemId));

        // Check if the user owns this item
        if (!item.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You are not authorized to update this item");
        }

        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setStatus(request.getStatus());
        item.setCategory(request.getCategory());
        item.setTag(request.getTag());
        item.setLocation(request.getLocation());

        Item updatedItem = itemRepository.save(item);
        log.info("Item updated successfully with id: {}", updatedItem.getId());

        return mapToResponse(updatedItem);
    }

    @Transactional
    public void deleteItem(Long itemId, Long userId) {
        log.info("Deleting item with id: {} by user id: {}", itemId, userId);

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFoundException("Item not found with id: " + itemId));

        // Check if the user owns this item
        if (!item.getUser().getId().equals(userId)) {
            throw new UnauthorizedAccessException("You are not authorized to delete this item");
        }

        itemRepository.delete(item);
        log.info("Item deleted successfully with id: {}", itemId);
    }

    private ItemResponse mapToResponse(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .status(item.getStatus())
                .category(item.getCategory())
                .tag(item.getTag())
                .location(item.getLocation())
                .userId(item.getUser().getId())
                .userName(item.getUser().getName())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}

