package controller;

import controller.dto.ItemRequest;
import controller.dto.ItemResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.ItemService;
import service.JwtService;
import service.entity.ItemCategory;
import service.entity.ItemStatus;
import service.entity.ItemTag;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Item Management", description = "APIs for creating and managing lost and found items")
public class ItemController {

    private final ItemService itemService;
    private final JwtService jwtService;

    @PostMapping
    @Operation(summary = "Create a new item", description = "Creates a new lost or found item")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Item created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ItemResponse> createItem(
            @Valid @RequestBody ItemRequest request,
            HttpServletRequest httpRequest) {
        Long userId = extractUserIdFromRequest(httpRequest);
        log.info("Create item request received from user id: {}", userId);

        ItemResponse response = itemService.createItem(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(
            summary = "Get items with optional filters",
            description = "Retrieves items with optional filtering by ID, status, category, tag, user, keyword, and pagination. All parameters are optional. Returns paginated results."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Items retrieved successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid parameters"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Page<ItemResponse>> getItems(
            @Parameter(description = "Item ID to retrieve a specific item") @RequestParam(required = false) Long id,
            @Parameter(description = "Filter by status (LOST or FOUND)") @RequestParam(required = false) ItemStatus status,
            @Parameter(description = "Filter by category") @RequestParam(required = false) ItemCategory category,
            @Parameter(description = "Filter by tag") @RequestParam(required = false) ItemTag tag,
            @Parameter(description = "Filter by user ID (or use 'my-items=true' for current user)") @RequestParam(required = false) Long userId,
            @Parameter(description = "Set to true to get items for the current authenticated user") @RequestParam(required = false, defaultValue = "false") boolean myItems,
            @Parameter(description = "Search keyword for title or description") @RequestParam(required = false) String keyword,
            @Parameter(description = "Page number (0-based)") @RequestParam(required = false, defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(required = false, defaultValue = "20") int size,
            HttpServletRequest httpRequest) {

        Long requestUserId = null;

        // If myItems is true, extract the current user's ID
        if (myItems) {
            requestUserId = extractUserIdFromRequest(httpRequest);
            log.info("Getting items for current user id: {}", requestUserId);
        } else if (userId != null) {
            requestUserId = userId;
        }

        log.info("Get items request - id: {}, status: {}, category: {}, tag: {}, userId: {}, keyword: {}, page: {}, size: {}",
                id, status, category, tag, requestUserId, keyword, page, size);

        Page<ItemResponse> responses = itemService.filterItems(
                id, status, category, tag, requestUserId, keyword, page, size
        );
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an item", description = "Updates an existing item (only by the owner)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Item updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Not the item owner"),
            @ApiResponse(responseCode = "404", description = "Item not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<ItemResponse> updateItem(
            @Parameter(description = "ID of the item to update") @PathVariable Long id,
            @Valid @RequestBody ItemRequest request,
            HttpServletRequest httpRequest) {
        Long userId = extractUserIdFromRequest(httpRequest);
        log.info("Update item request received for id: {} from user id: {}", id, userId);

        ItemResponse response = itemService.updateItem(id, request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an item", description = "Deletes an item (only by the owner)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Item deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Not the item owner"),
            @ApiResponse(responseCode = "404", description = "Item not found"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<Void> deleteItem(
            @Parameter(description = "ID of the item to delete") @PathVariable Long id,
            HttpServletRequest httpRequest) {
        Long userId = extractUserIdFromRequest(httpRequest);
        log.info("Delete item request received for id: {} from user id: {}", id, userId);

        itemService.deleteItem(id, userId);
        return ResponseEntity.noContent().build();
    }


    private Long extractUserIdFromRequest(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (jwtService.getCookieName().equals(cookie.getName())) {
                    String token = cookie.getValue();
                    return jwtService.extractUserId(token);
                }
            }
        }
        throw new RuntimeException("Unable to extract user ID from request");
    }
}

