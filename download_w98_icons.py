#!/usr/bin/env python3
"""
Download Windows 98 icons from https://win98icons.alexmeub.com/
"""

import os
import requests
from pathlib import Path

# Base URL for Windows 98 icons
BASE_URL = "https://win98icons.alexmeub.com/icons/png"

# Icons to download (name on the website -> local filename)
ICONS_TO_DOWNLOAD = {
    # System icons
    "computer-0": "computer.png",
    "computer-1": "computer_explorer.png",
    "computer-2": "computer_network.png",
    
    # Folder icons
    "directory_open_file_mydocs_32x32_32bit": "folder_open.png",
    "directory_closed_file_mydocs_32x32_32bit": "folder_closed.png",
    "directory_open_file_32x32_32bit": "folder_open_file.png",
    
    # Document icons
    "txt_file-0": "txt_file.png",
    "txt_file-1": "txt_file_alt.png",
    "html_file": "html_file.png",
    "image_file-0": "image_file.png",
    "image_file-1": "image_file_jpg.png",
    "image_file-2": "image_file_gif.png",
    "audio_file-0": "audio_file.png",
    "audio_file-1": "audio_file_mp3.png",
    "video_file-0": "video_file.png",
    "video_file-1": "video_file_mp4.png",
    "zip_file": "zip_file.png",
    
    # Application icons
    "msagent-0": "msagent.png",
    "msagent-1": "msagent_alt.png",
    "mspaint-0": "mspaint.png",
    "mspaint-1": "mspaint_file.png",
    "notepad-0": "notepad.png",
    "notepad-1": "notepad_file.png",
    "wordpad-0": "wordpad.png",
    "wordpad-1": "wordpad_file.png",
    "calc-0": "calculator.png",
    "calc-1": "calculator_alt.png",
    
    # Media icons
    "mplayer2-0": "media_player.png",
    "mplayer2-1": "media_player_alt.png",
    "cd-0": "cd_drive.png",
    "cd-1": "cd_music.png",
    "cd-2": "cd_rom.png",
    
    # Internet icons
    "iexplore-0": "internet_explorer.png",
    "iexplore-1": "internet_explorer_alt.png",
    "outlook-0": "outlook.png",
    "outlook-1": "outlook_mail.png",
    "msn-0": "msn.png",
    
    # Game icons
    "sol-0": "solitaire.png",
    "minesweeper-0": "minesweeper.png",
    "minesweeper-1": "minesweeper_alt.png",
    "winmine-0": "winmine.png",
    
    # Utility icons
    "cmd-0": "command_prompt.png",
    "cmd-1": "cmd.png",
    "regedit-0": "registry_editor.png",
    "msconfig-0": "system_config.png",
    
    # Control panel icons
    "cpl-0": "control_panel.png",
    "cpl-1": "control_panel_display.png",
    "cpl-2": "control_panel_sound.png",
    "cpl-3": "control_panel_network.png",
    "cpl-4": "control_panel_system.png",
    
    # Hardware icons
    "floppy-0": "floppy_disk.png",
    "floppy-1": "floppy_drive.png",
    "hard_drive-0": "hard_drive.png",
    "hard_drive-1": "hard_drive_c.png",
    "hard_drive-2": "hard_drive_d.png",
    "printer-0": "printer.png",
    "printer-1": "printer_local.png",
    "printer-2": "printer_network.png",
    
    # Network icons
    "network-0": "network.png",
    "network-1": "network_neighborhood.png",
    "network-2": "network_dialup.png",
    
    # Recycle bin
    "recycle_bin_empty-0": "recycle_bin_empty.png",
    "recycle_bin_full-0": "recycle_bin_full.png",
    
    # My Documents
    "my_documents-0": "my_documents.png",
    
    # Help
    "help-0": "help.png",
    "help-1": "help_book.png",
    
    # Search
    "search-0": "search.png",
    "search-1": "find.png",
    
    # Settings
    "settings-0": "settings.png",
    "settings-1": "tools.png",
    
    # User icons
    "user-0": "user.png",
    "user-1": "users.png",
    
    # Security
    "lock-0": "lock.png",
    "lock-1": "unlock.png",
    
    # File operations
    "copy-0": "copy.png",
    "cut-0": "cut.png",
    "paste-0": "paste.png",
    "delete-0": "delete.png",
    "rename-0": "rename.png",
    
    # View icons
    "view_large-0": "view_large.png",
    "view_small-0": "view_small.png",
    "view_list-0": "view_list.png",
    "view_details-0": "view_details.png",
    
    # Misc icons
    "clock-0": "clock.png",
    "calendar-0": "calendar.png",
    "phone-0": "phone.png",
    "fax-0": "fax.png",
    "camera-0": "camera.png",
    "scanner-0": "scanner.png",
    "microphone-0": "microphone.png",
    "speaker-0": "speaker.png",
    "speaker-1": "speaker_mute.png",
    "volume-0": "volume.png",
    "volume-1": "volume_high.png",
    "volume-2": "volume_low.png",
    "volume-3": "volume_mute.png",
    
    # Windows logo
    "win-0": "windows.png",
    "win-1": "windows_logo.png",
    
    # Error/warning/info
    "error-0": "error.png",
    "warning-0": "warning.png",
    "info-0": "info.png",
    "question-0": "question.png",
    
    # File types
    "exe_file-0": "exe_file.png",
    "dll_file-0": "dll_file.png",
    "sys_file-0": "sys_file.png",
    "bat_file-0": "bat_file.png",
    "com_file-0": "com_file.png",
    
    # Archive files
    "rar_file-0": "rar_file.png",
    "7z_file-0": "7z_file.png",
    "tar_file-0": "tar_file.png",
    "gz_file-0": "gz_file.png",
    
    # Office files
    "doc_file-0": "doc_file.png",
    "xls_file-0": "xls_file.png",
    "ppt_file-0": "ppt_file.png",
    
    # Programming files
    "c_file-0": "c_file.png",
    "cpp_file-0": "cpp_file.png",
    "h_file-0": "h_file.png",
    "py_file-0": "py_file.png",
    "js_file-0": "js_file.png",
    "html_file-0": "html_file.png",
    "css_file-0": "css_file.png",
    "json_file-0": "json_file.png",
    "xml_file-0": "xml_file.png",
    
    # Database files
    "db_file-0": "db_file.png",
    "sql_file-0": "sql_file.png",
    "mdb_file-0": "mdb_file.png",
    
    # Misc files
    "pdf_file-0": "pdf_file.png",
    "rtf_file-0": "rtf_file.png",
    "log_file-0": "log_file.png",
    "cfg_file-0": "cfg_file.png",
    "ini_file-0": "ini_file.png",
    
    # Desktop
    "desktop-0": "desktop.png",
    "desktop-1": "my_computer.png",
    
    # Start menu
    "start-0": "start.png",
    "start-1": "start_menu.png",
    
    # Taskbar
    "taskbar-0": "taskbar.png",
    
    # Shutdown
    "shutdown-0": "shutdown.png",
    "shutdown-1": "power_off.png",
    "restart-0": "restart.png",
    "logoff-0": "logoff.png",
    
    # New icons
    "new-0": "new.png",
    "new-1": "new_file.png",
    "new-2": "new_folder.png",
    
    # Open/Save
    "open-0": "open.png",
    "open-1": "open_file.png",
    "save-0": "save.png",
    "save-1": "save_as.png",
    
    # Print
    "print-0": "print.png",
    "print-1": "print_preview.png",
    
    # Edit
    "edit-0": "edit.png",
    "edit-1": "edit_file.png",
    
    # Find
    "find-0": "find.png",
    "find-1": "find_next.png",
    "find-2": "find_previous.png",
    
    # Replace
    "replace-0": "replace.png",
    
    # Go to
    "goto-0": "goto.png",
    "goto-1": "goto_line.png",
    
    # Select
    "select-0": "select_all.png",
    "select-1": "select_invert.png",
    
    # Time/Date
    "time-0": "time.png",
    "date-0": "date.png",
    
    # Properties
    "properties-0": "properties.png",
    
    # About
    "about-0": "about.png",
    
    # Refresh
    "refresh-0": "refresh.png",
    
    # Stop
    "stop-0": "stop.png",
    
    # Home
    "home-0": "home.png",
    
    # Forward/Back
    "forward-0": "forward.png",
    "back-0": "back.png",
    
    # Up
    "up-0": "up.png",
    "up-1": "up_level.png",
    
    # Favorites
    "favorites-0": "favorites.png",
    "favorites-1": "bookmarks.png",
    
    # History
    "history-0": "history.png",
    
    # Downloads
    "downloads-0": "downloads.png",
    
    # Upload
    "upload-0": "upload.png",
    
    # Sync
    "sync-0": "sync.png",
    
    # Cloud
    "cloud-0": "cloud.png",
    "cloud-1": "cloud_upload.png",
    "cloud-2": "cloud_download.png",
    
    # Share
    "share-0": "share.png",
    
    # Link
    "link-0": "link.png",
    "link-1": "hyperlink.png",
    
    # Email
    "email-0": "email.png",
    "email-1": "email_new.png",
    "email-2": "email_send.png",
    "email-3": "email_receive.png",
    
    # Contact
    "contact-0": "contact.png",
    "contact-1": "address_book.png",
    
    # Calendar
    "calendar-1": "calendar_event.png",
    
    # Task
    "task-0": "task.png",
    "task-1": "todo.png",
    
    # Note
    "note-0": "note.png",
    "note-1": "sticky_note.png",
    
    # Bookmark
    "bookmark-0": "bookmark.png",
    "bookmark-1": "bookmark_add.png",
    
    # Tag
    "tag-0": "tag.png",
    "tag-1": "label.png",
    
    # Star
    "star-0": "star.png",
    "star-1": "star_empty.png",
    "star-2": "star_half.png",
    
    # Heart
    "heart-0": "heart.png",
    "heart-1": "heart_empty.png",
    
    # Thumbs up/down
    "thumbs_up-0": "thumbs_up.png",
    "thumbs_down-0": "thumbs_down.png",
    
    # Check
    "check-0": "check.png",
    "check-1": "check_box.png",
    "check-2": "check_box_checked.png",
    "check-3": "check_box_unchecked.png",
    
    # Radio
    "radio-0": "radio_button.png",
    "radio-1": "radio_button_checked.png",
    "radio-2": "radio_button_unchecked.png",
    
    # Close
    "close-0": "close.png",
    "close-1": "close_window.png",
    
    # Maximize
    "maximize-0": "maximize.png",
    "maximize-1": "maximize_window.png",
    
    # Minimize
    "minimize-0": "minimize.png",
    "minimize-1": "minimize_window.png",
    
    # Restore
    "restore-0": "restore.png",
    "restore-1": "restore_window.png",
    
    # Fullscreen
    "fullscreen-0": "fullscreen.png",
    "fullscreen-1": "exit_fullscreen.png",
    
    # Screenshot
    "screenshot-0": "screenshot.png",
    
    # Zoom
    "zoom_in-0": "zoom_in.png",
    "zoom_out-0": "zoom_out.png",
    "zoom-0": "zoom.png",
    "zoom-1": "zoom_fit.png",
    "zoom-2": "zoom_actual.png",
    
    # Rotate
    "rotate_left-0": "rotate_left.png",
    "rotate_right-0": "rotate_right.png",
    
    # Flip
    "flip_horizontal-0": "flip_horizontal.png",
    "flip_vertical-0": "flip_vertical.png",
    
    # Crop
    "crop-0": "crop.png",
    
    # Filter
    "filter-0": "filter.png",
    
    # Adjust
    "adjust-0": "adjust.png",
    "adjust-1": "brightness.png",
    "adjust-2": "contrast.png",
    "adjust-3": "saturation.png",
    
    # Effects
    "effects-0": "effects.png",
    
    # Text
    "text-0": "text.png",
    "text-1": "add_text.png",
    
    # Shape
    "shape-0": "shape.png",
    "shape-1": "rectangle.png",
    "shape-2": "circle.png",
    "shape-3": "triangle.png",
    "shape-4": "line.png",
    "shape-5": "arrow.png",
    
    # Color
    "color-0": "color.png",
    "color-1": "color_palette.png",
    "color-2": "color_picker.png",
    "color-3": "fill_color.png",
    "color-4": "stroke_color.png",
    
    # Brush
    "brush-0": "brush.png",
    "brush-1": "paint_brush.png",
    
    # Eraser
    "eraser-0": "eraser.png",
    
    # Pencil
    "pencil-0": "pencil.png",
    
    # Pen
    "pen-0": "pen.png",
    
    # Marker
    "marker-0": "marker.png",
    
    # Fill
    "fill-0": "fill.png",
    "fill-1": "bucket.png",
    
    # Gradient
    "gradient-0": "gradient.png",
    
    # Pattern
    "pattern-0": "pattern.png",
    
    # Layers
    "layers-0": "layers.png",
    "layers-1": "layer_add.png",
    "layers-2": "layer_delete.png",
    "layers-3": "layer_duplicate.png",
    "layers-4": "layer_merge.png",
    "layers-5": "layer_lock.png",
    "layers-6": "layer_unlock.png",
    "layers-7": "layer_visible.png",
    "layers-8": "layer_hidden.png",
    
    # Group
    "group-0": "group.png",
    "group-1": "ungroup.png",
    
    # Align
    "align_left-0": "align_left.png",
    "align_center-0": "align_center.png",
    "align_right-0": "align_right.png",
    "align_justify-0": "align_justify.png",
    "align_top-0": "align_top.png",
    "align_middle-0": "align_middle.png",
    "align_bottom-0": "align_bottom.png",
    
    # Distribute
    "distribute-0": "distribute.png",
    "distribute-1": "distribute_horizontal.png",
    "distribute-2": "distribute_vertical.png",
    
    # Order
    "order-0": "order.png",
    "order-1": "bring_to_front.png",
    "order-2": "send_to_back.png",
    "order-3": "bring_forward.png",
    "order-4": "send_backward.png",
    
    # Grid
    "grid-0": "grid.png",
    "grid-1": "grid_show.png",
    "grid-2": "grid_hide.png",
    "grid-3": "grid_snap.png",
    
    # Guides
    "guides-0": "guides.png",
    "guides-1": "guides_show.png",
    "guides-2": "guides_hide.png",
    "guides-3": "guides_lock.png",
    
    # Rulers
    "rulers-0": "rulers.png",
    "rulers-1": "rulers_show.png",
    "rulers-2": "rulers_hide.png",
    
    # Smart guides
    "smart_guides-0": "smart_guides.png",
    
    # Snap
    "snap-0": "snap.png",
    "snap-1": "snap_to_grid.png",
    "snap-2": "snap_to_guides.png",
    "snap-3": "snap_to_pixels.png",
    
    # Undo/Redo
    "undo-0": "undo.png",
    "redo-0": "redo.png",
    
    # History
    "history-1": "history_undo.png",
    "history-2": "history_redo.png",
    
    # Clear
    "clear-0": "clear.png",
    "clear-1": "clear_all.png",
    
    # Reset
    "reset-0": "reset.png",
    
    # Default
    "default-0": "default.png",
    
    # Apply
    "apply-0": "apply.png",
    
    # OK
    "ok-0": "ok.png",
    
    # Cancel
    "cancel-0": "cancel.png",
    
    # Yes
    "yes-0": "yes.png",
    
    # No
    "no-0": "no.png",
    
    # Accept
    "accept-0": "accept.png",
    
    # Decline
    "decline-0": "decline.png",
    
    # Confirm
    "confirm-0": "confirm.png",
    
    # Deny
    "deny-0": "deny.png",
    
    # Approve
    "approve-0": "approve.png",
    
    # Reject
    "reject-0": "reject.png",
    
    # Authorize
    "authorize-0": "authorize.png",
    
    # Sign
    "sign-0": "sign.png",
    "sign-1": "signature.png",
    
    # Verify
    "verify-0": "verify.png",
    
    # Validate
    "validate-0": "validate.png",
    
    # Authenticate
    "authenticate-0": "authenticate.png",
    
    # Login
    "login-0": "login.png",
    "login-1": "log_in.png",
    
    # Logout
    "logout-0": "logout.png",
    "logout-1": "log_out.png",
    
    # Register
    "register-0": "register.png",
    "register-1": "sign_up.png",
    
    # Signup
    "signup-0": "signup.png",
    "signup-1": "create_account.png",
    
    # Account
    "account-0": "account.png",
    "account-1": "my_account.png",
    
    # Profile
    "profile-0": "profile.png",
    "profile-1": "user_profile.png",
    
    # Settings
    "settings-1": "preferences.png",
    "settings-2": "options.png",
    
    # Configuration
    "configuration-0": "configuration.png",
    
    # Customization
    "customization-0": "customization.png",
    
    # Personalization
    "personalization-0": "personalization.png",
    
    # Appearance
    "appearance-0": "appearance.png",
    
    # Theme
    "theme-0": "theme.png",
    
    # Display
    "display-0": "display.png",
    "display-1": "screen.png",
    "display-2": "monitor.png",
    
    # Sound
    "sound-0": "sound.png",
    "sound-1": "audio.png",
    
    # Notifications
    "notifications-0": "notifications.png",
    "notifications-1": "alert.png",
    "notifications-2": "bell.png",
    
    # Privacy
    "privacy-0": "privacy.png",
    
    # Security
    "security-0": "security.png",
    
    # Backup
    "backup-0": "backup.png",
    "backup-1": "backup_restore.png",
    
    # Restore
    "restore-2": "restore_backup.png",
    
    # Update
    "update-0": "update.png",
    "update-1": "upgrade.png",
    
    # Install
    "install-0": "install.png",
    
    # Uninstall
    "uninstall-0": "uninstall.png",
    
    # Download
    "downloads-1": "download.png",
    
    # Upload
    "upload-1": "upload_file.png",
    
    # Import
    "import-0": "import.png",
    
    # Export
    "export-0": "export.png",
    
    # Share
    "share-1": "share_file.png",
    
    # Send
    "send-0": "send.png",
    
    # Receive
    "receive-0": "receive.png",
    
    # Transfer
    "transfer-0": "transfer.png",
    
    # Move
    "move-0": "move.png",
    
    # Copy
    "copy-1": "copy_file.png",
    
    # Paste
    "paste-1": "paste_file.png",
    
    # Cut
    "cut-1": "cut_file.png",
    
    # Duplicate
    "duplicate-0": "duplicate.png",
    
    # Clone
    "clone-0": "clone.png",
    
    # Archive
    "archive-0": "archive.png",
    "archive-1": "compress.png",
    
    # Extract
    "extract-0": "extract.png",
    "extract-1": "uncompress.png",
    
    # Compress
    "compress-0": "compress.png",
    
    # Decompress
    "decompress-0": "decompress.png",
    
    # Encrypt
    "encrypt-0": "encrypt.png",
    
    # Decrypt
    "decrypt-0": "decrypt.png",
    
    # Lock
    "lock-2": "lock_file.png",
    
    # Unlock
    "unlock-1": "unlock_file.png",
    
    # Protect
    "protect-0": "protect.png",
    
    # Unprotect
    "unprotect-0": "unprotect.png",
    
    # Hide
    "hide-0": "hide.png",
    
    # Show
    "show-0": "show.png",
    
    # Visible
    "visible-0": "visible.png",
    
    # Invisible
    "invisible-0": "invisible.png",
    
    # Enable
    "enable-0": "enable.png",
    
    # Disable
    "disable-0": "disable.png",
    
    # Activate
    "activate-0": "activate.png",
    
    # Deactivate
    "deactivate-0": "deactivate.png",
    
    # Turn on
    "turn_on-0": "turn_on.png",
    
    # Turn off
    "turn_off-0": "turn_off.png",
    
    # Switch on
    "switch_on-0": "switch_on.png",
    
    # Switch off
    "switch_off-0": "switch_off.png",
    
    # Toggle
    "toggle-0": "toggle.png",
    
    # Check
    "check-4": "check_mark.png",
    
    # Uncheck
    "uncheck-0": "uncheck.png",
    
    # Select
    "select-2": "select.png",
    
    # Deselect
    "deselect-0": "deselect.png",
    
    # Multi-select
    "multi_select-0": "multi_select.png",
    
    # Expand
    "expand-0": "expand.png",
    
    # Collapse
    "collapse-0": "collapse.png",
    
    # More
    "more-0": "more.png",
    "more-1": "more_horiz.png",
    "more-2": "more_vert.png",
    
    # Less
    "less-0": "less.png",
    
    # Menu
    "menu-0": "menu.png",
    "menu-1": "menu_hamburger.png",
    "menu-2": "menu_dots.png",
    
    # Sidebar
    "sidebar-0": "sidebar.png",
    "sidebar-1": "sidebar_left.png",
    "sidebar-2": "sidebar_right.png",
    
    # Panel
    "panel-0": "panel.png",
    "panel-1": "panel_left.png",
    "panel-2": "panel_right.png",
    "panel-3": "panel_top.png",
    "panel-4": "panel_bottom.png",
    
    # Drawer
    "drawer-0": "drawer.png",
    "drawer-1": "drawer_left.png",
    "drawer-2": "drawer_right.png",
    "drawer-3": "drawer_top.png",
    "drawer-4": "drawer_bottom.png",
    
    # Dialog
    "dialog-0": "dialog.png",
    "dialog-1": "modal.png",
    
    # Popup
    "popup-0": "popup.png",
    
    # Tooltip
    "tooltip-0": "tooltip.png",
    
    # Dropdown
    "dropdown-0": "dropdown.png",
    
    # Accordion
    "accordion-0": "accordion.png",
    
    # Tabs
    "tabs-0": "tabs.png",
    
    # Breadcrumb
    "breadcrumb-0": "breadcrumb.png",
    
    # Pagination
    "pagination-0": "pagination.png",
    
    # Progress
    "progress-0": "progress.png",
    "progress-1": "progress_bar.png",
    "progress-2": "progress_circle.png",
    
    # Loading
    "loading-0": "loading.png",
    "loading-1": "spinner.png",
    
    # Spinner
    "spinner-0": "spinner.png",
    
    # Skeleton
    "skeleton-0": "skeleton.png",
    
    # Placeholder
    "placeholder-0": "placeholder.png",
    
    # Empty
    "empty-0": "empty.png",
    "empty-1": "empty_state.png",
    
    # No data
    "no_data-0": "no_data.png",
    
    # No results
    "no_results-0": "no_results.png",
    
    # Not found
    "not_found-0": "not_found.png",
    
    # 404
    "error-1": "error_404.png",
    
    # 500
    "error-2": "error_500.png",
    
    # Server error
    "error-3": "server_error.png",
    
    # Network error
    "error-4": "network_error.png",
    
    # Connection error
    "error-5": "connection_error.png",
    
    # Timeout
    "error-6": "timeout.png",
    
    # Offline
    "offline-0": "offline.png",
    
    # Online
    "online-0": "online.png",
    
    # Connected
    "connected-0": "connected.png",
    
    # Disconnected
    "disconnected-0": "disconnected.png",
    
    # Syncing
    "syncing-0": "syncing.png",
    
    # Synced
    "synced-0": "synced.png",
    
    # Pending
    "pending-0": "pending.png",
    
    # Processing
    "processing-0": "processing.png",
    
    # Completed
    "completed-0": "completed.png",
    
    # Success
    "success-0": "success.png",
    
    # Failed
    "failed-0": "failed.png",
    
    # Cancelled
    "cancelled-0": "cancelled.png",
    
    # Aborted
    "aborted-0": "aborted.png",
    
    # Queued
    "queued-0": "queued.png",
    
    # Scheduled
    "scheduled-0": "scheduled.png",
    
    # Running
    "running-0": "running.png",
    
    # Paused
    "paused-0": "paused.png",
    
    # Stopped
    "stopped-0": "stopped.png",
    
    # Finished
    "finished-0": "finished.png",
    
    # Done
    "done-0": "done.png",
    
    # Ready
    "ready-0": "ready.png",
    
    # Waiting
    "waiting-0": "waiting.png",
    
    # In progress
    "in_progress-0": "in_progress.png",
    
    # Active
    "active-0": "active.png",
    
    # Inactive
    "inactive-0": "inactive.png",
    
    # Enabled
    "enabled-0": "enabled.png",
    
    # Disabled
    "disabled-0": "disabled.png",
    
    # Available
    "available-0": "available.png",
    
    # Unavailable
    "unavailable-0": "unavailable.png",
    
    # Busy
    "busy-0": "busy.png",
    
    # Away
    "away-0": "away.png",
    
    # Idle
    "idle-0": "idle.png",
    
    # Do not disturb
    "do_not_disturb-0": "do_not_disturb.png",
    
    # Invisible
    "invisible-1": "invisible_status.png",
    
    # Status
    "status-0": "status.png",
    
    # State
    "state-0": "state.png",
    
    # Flag
    "flag-0": "flag.png",
    "flag-1": "flag_red.png",
    "flag-2": "flag_yellow.png",
    "flag-3": "flag_green.png",
    "flag-4": "flag_blue.png",
    
    # Pin
    "pin-0": "pin.png",
    "pin-1": "pinned.png",
    "pin-2": "unpin.png",
    
    # Archive
    "archive-2": "archive_folder.png",
    
    # Trash
    "trash-0": "trash.png",
    "trash-1": "trash_empty.png",
    "trash-2": "trash_full.png",
    
    # Delete
    "delete-1": "delete_forever.png",
    
    # Remove
    "remove-0": "remove.png",
    
    # Clear
    "clear-2": "clear_cache.png",
    
    # Clean
    "clean-0": "clean.png",
    
    # Scan
    "scan-0": "scan.png",
    "scan-1": "scan_qr.png",
    "scan-2": "scan_barcode.png",
    
    # Search
    "search-1": "search_file.png",
    
    # Filter
    "filter-1": "filter_list.png",
    
    # Sort
    "sort-0": "sort.png",
    "sort-1": "sort_asc.png",
    "sort-2": "sort_desc.png",
    
    # Group by
    "group_by-0": "group_by.png",
    
    # Arrange
    "arrange-0": "arrange.png",
    
    # Organize
    "organize-0": "organize.png",
    
    # Categorize
    "categorize-0": "categorize.png",
    
    # Classify
    "classify-0": "classify.png",
    
    # Tag
    "tag-2": "tag_add.png",
    
    # Label
    "label-1": "label_add.png",
    
    # Mark
    "mark-0": "mark.png",
    
    # Highlight
    "highlight-0": "highlight.png",
    
    # Bookmark
    "bookmark-2": "bookmark_remove.png",
    
    # Favorite
    "favorite-0": "favorite.png",
    "favorite-1": "favorite_add.png",
    "favorite-2": "favorite_remove.png",
    
    # Like
    "like-0": "like.png",
    "like-1": "like_add.png",
    "like-2": "like_remove.png",
    
    # Dislike
    "dislike-0": "dislike.png",
    
    # Rate
    "rate-0": "rate.png",
    
    # Review
    "review-0": "review.png",
    
    # Comment
    "comment-0": "comment.png",
    "comment-1": "comment_add.png",
    "comment-2": "comment_remove.png",
    
    # Reply
    "reply-0": "reply.png",
    
    # Forward
    "forward-1": "forward_message.png",
    
    # Quote
    "quote-0": "quote.png",
    
    # Mention
    "mention-0": "mention.png",
    
    # Notify
    "notify-0": "notify.png",
    
    # Alert
    "alert-0": "alert.png",
    "alert-1": "alert_warning.png",
    "alert-2": "alert_error.png",
    "alert-3": "alert_info.png",
    "alert-4": "alert_success.png",
    
    # Notification
    "notifications-2": "notification_add.png",
    "notifications-3": "notification_remove.png",
    "notifications-4": "notification_clear.png",
    
    # Message
    "message-0": "message.png",
    "message-1": "message_new.png",
    "message-2": "message_sent.png",
    "message-3": "message_received.png",
    "message-4": "message_read.png",
    "message-5": "message_unread.png",
    
    # Chat
    "chat-0": "chat.png",
    "chat-1": "chat_new.png",
    
    # Conversation
    "conversation-0": "conversation.png",
    
    # Discussion
    "discussion-0": "discussion.png",
    
    # Thread
    "thread-0": "thread.png",
    
    # Channel
    "channel-0": "channel.png",
    
    # Group chat
    "group_chat-0": "group_chat.png",
    
    # Direct message
    "direct_message-0": "direct_message.png",
    
    # Private message
    "private_message-0": "private_message.png",
    
    # Public message
    "public_message-0": "public_message.png",
    
    # Broadcast
    "broadcast-0": "broadcast.png",
    
    # Announce
    "announce-0": "announce.png",
    
    # Publish
    "publish-0": "publish.png",
    
    # Subscribe
    "subscribe-0": "subscribe.png",
    
    # Unsubscribe
    "unsubscribe-0": "unsubscribe.png",
    
    # Follow
    "follow-0": "follow.png",
    
    # Unfollow
    "unfollow-0": "unfollow.png",
    
    # Connect
    "connect-0": "connect.png",
    
    # Disconnect
    "disconnect-0": "disconnect.png",
    
    # Link
    "link-2": "link_add.png",
    "link-3": "link_remove.png",
    
    # Unlink
    "unlink-0": "unlink.png",
    
    # Attach
    "attach-0": "attach.png",
    "attach-1": "attachment.png",
    "attach-2": "attachment_add.png",
    "attach-3": "attachment_remove.png",
    
    # Detach
    "detach-0": "detach.png",
    
    # Embed
    "embed-0": "embed.png",
    
    # Code
    "code-0": "code.png",
    "code-1": "source_code.png",
    "code-2": "code_block.png",
    
    # Terminal
    "terminal-0": "terminal.png",
    "terminal-1": "console.png",
    
    # Command
    "command-1": "command_line.png",
    
    # Script
    "script-0": "script.png",
    
    # Macro
    "macro-0": "macro.png",
    
    # Function
    "function-0": "function.png",
    
    # Variable
    "variable-0": "variable.png",
    
    # Constant
    "constant-0": "constant.png",
    
    # Parameter
    "parameter-0": "parameter.png",
    
    # Argument
    "argument-0": "argument.png",
    
    # Return
    "return-0": "return.png",
    
    # Value
    "value-0": "value.png",
    
    # Type
    "type-0": "type.png",
    
    # Class
    "class-0": "class.png",
    
    # Object
    "object-0": "object.png",
    
    # Instance
    "instance-0": "instance.png",
    
    # Method
    "method-0": "method.png",
    
    # Property
    "property-0": "property.png",
    
    # Attribute
    "attribute-0": "attribute.png",
    
    # Field
    "field-0": "field.png",
    
    # Element
    "element-0": "element.png",
    
    # Node
    "node-0": "node.png",
    
    # Tree
    "tree-0": "tree.png",
    
    # Graph
    "graph-0": "graph.png",
    
    # Chart
    "chart-0": "chart.png",
    "chart-1": "chart_bar.png",
    "chart-2": "chart_line.png",
    "chart-3": "chart_pie.png",
    "chart-4": "chart_area.png",
    "chart-5": "chart_scatter.png",
    "chart-6": "chart_doughnut.png",
    "chart-7": "chart_radar.png",
    
    # Table
    "table-0": "table.png",
    
    # List
    "list-0": "list.png",
    "list-1": "list_bullet.png",
    "list-2": "list_numbered.png",
    
    # Grid
    "grid-4": "grid_view.png",
    
    # Card
    "card-0": "card.png",
    
    # Tile
    "tile-0": "tile.png",
    
    # Block
    "block-0": "block.png",
    
    # Section
    "section-0": "section.png",
    
    # Row
    "row-0": "row.png",
    
    # Column
    "column-0": "column.png",
    
    # Cell
    "cell-0": "cell.png",
    
    # Header
    "header-0": "header.png",
    
    # Footer
    "footer-0": "footer.png",
    
    # Sidebar
    "sidebar-3": "sidebar_menu.png",
    
    # Navbar
    "navbar-0": "navbar.png",
    
    # Toolbar
    "toolbar-0": "toolbar.png",
    
    # Statusbar
    "statusbar-0": "statusbar.png",
    
    # Menubar
    "menubar-0": "menubar.png",
    
    # Tabbar
    "tabbar-0": "tabbar.png",
    
    # Actionbar
    "actionbar-0": "actionbar.png",
    
    # Titlebar
    "titlebar-0": "titlebar.png",
    
    # Content
    "content-0": "content.png",
    
    # Container
    "container-0": "container.png",
    
    # Wrapper
    "wrapper-0": "wrapper.png",
    
    # Layout
    "layout-0": "layout.png",
    
    # Template
    "template-0": "template.png",
    
    # Component
    "component-0": "component.png",
    
    # Module
    "module-0": "module.png",
    
    # Package
    "package-0": "package.png",
    
    # Library
    "library-0": "library.png",
    
    # Plugin
    "plugin-0": "plugin.png",
    
    # Extension
    "extension-0": "extension.png",
    
    # Addon
    "addon-0": "addon.png",
    
    # Widget
    "widget-0": "widget.png",
    
    # Gadget
    "gadget-0": "gadget.png",
    
    # App
    "app-0": "app.png",
    "app-1": "application.png",
    
    # Program
    "program-0": "program.png",
    
    # Software
    "software-0": "software.png",
    
    # System
    "system-0": "system.png",
    
    # OS
    "os-0": "os.png",
    
    # Platform
    "platform-0": "platform.png",
    
    # Device
    "device-0": "device.png",
    "device-1": "device_mobile.png",
    "device-2": "device_tablet.png",
    "device-3": "device_desktop.png",
    "device-4": "device_laptop.png",
    
    # Hardware
    "hardware-0": "hardware.png",
    
    # CPU
    "cpu-0": "cpu.png",
    
    # Memory
    "memory-0": "memory.png",
    "memory-1": "ram.png",
    
    # Storage
    "storage-0": "storage.png",
    
    # Disk
    "disk-0": "disk.png",
    "disk-1": "disk_local.png",
    "disk-2": "disk_network.png",
    "disk-3": "disk_external.png",
    
    # Drive
    "drive-0": "drive.png",
    "drive-1": "drive_hard.png",
    "drive-2": "drive_optical.png",
    "drive-3": "drive_usb.png",
    
    # Partition
    "partition-0": "partition.png",
    
    # Volume
    "volume-4": "volume_disk.png",
    
    # File system
    "filesystem-0": "filesystem.png",
    
    # Network
    "network-3": "network_ethernet.png",
    "network-4": "network_wifi.png",
    "network-5": "network_bluetooth.png",
    
    # Connection
    "connection-0": "connection.png",
    "connection-1": "connection_wired.png",
    "connection-2": "connection_wireless.png",
    
    # Signal
    "signal-0": "signal.png",
    "signal-1": "signal_wifi.png",
    "signal-2": "signal_cellular.png",
    
    # Battery
    "battery-0": "battery.png",
    "battery-1": "battery_full.png",
    "battery-2": "battery_high.png",
    "battery-3": "battery_medium.png",
    "battery-4": "battery_low.png",
    "battery-5": "battery_empty.png",
    "battery-6": "battery_charging.png",
    
    # Power
    "power-0": "power.png",
    "power-1": "power_cable.png",
    
    # Temperature
    "temperature-0": "temperature.png",
    "temperature-1": "thermometer.png",
    
    # Fan
    "fan-0": "fan.png",
    
    # Light
    "light-0": "light.png",
    "light-1": "lightbulb.png",
    
    # Sensor
    "sensor-0": "sensor.png",
    
    # Monitor
    "monitor-0": "monitor.png",
    
    # Screen
    "screen-0": "screen.png",
    "screen-1": "screenshot.png",
    
    # Keyboard
    "keyboard-0": "keyboard.png",
    
    # Mouse
    "mouse-0": "mouse.png",
    
    # Touchpad
    "touchpad-0": "touchpad.png",
    
    # Trackpad
    "trackpad-0": "trackpad.png",
    
    # Stylus
    "stylus-0": "stylus.png",
    
    # Pen input
    "pen_input-0": "pen_input.png",
    
    # Touchscreen
    "touchscreen-0": "touchscreen.png",
    
    # Fingerprint
    "fingerprint-0": "fingerprint.png",
    
    # Face ID
    "face_id-0": "face_id.png",
    
    # Iris
    "iris-0": "iris.png",
    
    # Voice
    "voice-0": "voice.png",
    
    # Speech
    "speech-0": "speech.png",
    
    # Audio
    "audio-0": "audio.png",
    "audio-1": "audio_input.png",
    "audio-2": "audio_output.png",
    
    # Video
    "video-1": "video_input.png",
    "video-2": "video_output.png",
    
    # Camera
    "camera-1": "camera_input.png",
    
    # Microphone
    "microphone-1": "microphone_input.png",
    
    # Speaker
    "speaker-2": "speaker_output.png",
    
    # Headphones
    "headphones-0": "headphones.png",
    
    # Earphones
    "earphones-0": "earphones.png",
    
    # Headset
    "headset-0": "headset.png",
    
    # VR
    "vr-0": "vr.png",
    
    # AR
    "ar-0": "ar.png",
    
    # Mixed reality
    "mixed_reality-0": "mixed_reality.png",
    
    # Hologram
    "hologram-0": "hologram.png",
    
    # 3D
    "3d-0": "3d.png",
    
    # Model
    "model-0": "model.png",
    "model-1": "3d_model.png",
    
    # Scene
    "scene-0": "scene.png",
    "scene-1": "3d_scene.png",
    
    # Texture
    "texture-0": "texture.png",
    
    # Material
    "material-0": "material.png",
    
    # Light
    "light-2": "3d_light.png",
    
    # Camera
    "camera-2": "3d_camera.png",
    
    # Render
    "render-0": "render.png",
    
    # Animation
    "animation-0": "animation.png",
    
    # Timeline
    "timeline-0": "timeline.png",
    
    # Keyframe
    "keyframe-0": "keyframe.png",
    
    # Track
    "track-0": "track.png",
    
    # Clip
    "clip-0": "clip.png",
    
    # Sequence
    "sequence-0": "sequence.png",
    
    # Project
    "project-0": "project.png",
    
    # Workspace
    "workspace-0": "workspace.png",
    
    # Document
    "document-0": "document.png",
    "document-1": "file_document.png",
    
    # File
    "file-0": "file.png",
    "file-1": "file_new.png",
    "file-2": "file_open.png",
    "file-3": "file_save.png",
    "file-4": "file_close.png",
    "file-5": "file_print.png",
    "file-6": "file_export.png",
    "file-7": "file_import.png",
    "file-8": "file_share.png",
    "file-9": "file_delete.png",
    "file-10": "file_rename.png",
    "file-11": "file_copy.png",
    "file-12": "file_move.png",
    "file-13": "file_properties.png",
    
    # Folder
    "folder-0": "folder.png",
    "folder-1": "folder_new.png",
    "folder-2": "folder_open.png",
    "folder-3": "folder_close.png",
    "folder-4": "folder_copy.png",
    "folder-5": "folder_move.png",
    "folder-6": "folder_delete.png",
    "folder-7": "folder_rename.png",
    "folder-8": "folder_properties.png",
}

def download_icon(icon_name, filename, output_dir):
    """Download a single icon from the Windows 98 icon archive."""
    url = f"{BASE_URL}/{icon_name}.png"
    output_path = os.path.join(output_dir, filename)
    
    # Skip if file already exists
    if os.path.exists(output_path):
        print(f"✓ Already exists: {filename}")
        return True
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        print(f"✓ Downloaded: {filename}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"✗ Failed to download {icon_name}: {e}")
        return False

def main():
    """Download all icons from the Windows 98 icon archive."""
    # Create output directory
    output_dir = "public/icons/w98"
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Downloading Windows 98 icons to {output_dir}/")
    print(f"Total icons to download: {len(ICONS_TO_DOWNLOAD)}")
    print("-" * 60)
    
    success_count = 0
    fail_count = 0
    
    for icon_name, filename in ICONS_TO_DOWNLOAD.items():
        if download_icon(icon_name, filename, output_dir):
            success_count += 1
        else:
            fail_count += 1
    
    print("-" * 60)
    print(f"Download complete!")
    print(f"✓ Successfully downloaded: {success_count}")
    print(f"✗ Failed to download: {fail_count}")
    print(f"Total: {success_count + fail_count}")

if __name__ == "__main__":
    main()
