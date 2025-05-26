// Function to apply search feature to any CodeMirror editor instance
function applySearchFeatureOnEditor(editor) {
    // Create search panel
    const $searchPanel = $('<div class="bg_color_light">').addClass('search-panel').hide();
    
    $searchPanel.html(`
        <div class="search-container">
            <i class="toggle-replace angle right icon" title="Toggle Replace (Ctrl+H)"></i>
            <div class="search-inputs">
                <div class="search-row">
                    <div class="ui input small"><input type="text" class="search-input" placeholder="Search..."></div>
                    <div class="match-count"></div>
                    <div class="search-options">
                        <div class="ui icon buttons tiny">
                            <button class="ui button icon tiny btn_color_light option-button match-case" title="Match Case (Alt+C)">Aa</button>
                            <button class="ui button icon tiny btn_color_light option-button match-word" title="Match Whole Word (Alt+W)">\\b</button>
                            <button class="ui button icon tiny btn_color_light option-button use-regex" title="Use Regular Expression (Alt+R)">.*</button>
                        </div>
                       
                    </div>
                    <div class="search-buttons">
                        <div class="ui icon buttons tiny">
                            <button class="ui button icon tiny btn_color_light prev-match" title="Previous match (Shift+Enter)"><i class="arrow up icon"></i></button>
                            <button class="ui button icon tiny btn_color_light next-match" title="Next match (Enter)"><i class="arrow down icon"></i></button>
                            <button class="ui button icon tiny btn_color_light close-search" title="Close (Esc)"><i class="close icon"></i></button>
                        </div>
                    </div>
                </div>
                <div class="replace-row hidden">
                    <div class="ui form"><div class="ui input small"><input type="text" class="replace-input" placeholder="Replace..."></div></div>
                    <div class="replace-buttons">
                        <button class="ui button tiny btn_color_light replace" title="Replace (Ctrl+Shift+H)">Replace</button>
                        <button class="ui button tiny btn_color_light replace-all" title="Replace All (Ctrl+Alt+Enter)">Replace All</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    // Add search panel to editor's wrapper
    $(editor.getWrapperElement()).append($searchPanel);

    // Search state
    let searchCursor = null;
    let searchMarks = [];
    let currentMatchIndex = 0;
    let totalMatches = 0;
    let matchCase = false;
    let matchWord = false;
    let useRegex = false;
    let searchTimeout = null;

    // Get elements
    const $searchInput = $searchPanel.find('.search-input');
    const $replaceInput = $searchPanel.find('.replace-input');
    const $prevButton = $searchPanel.find('.prev-match');
    const $nextButton = $searchPanel.find('.next-match');
    const $replaceButton = $searchPanel.find('.replace');
    const $replaceAllButton = $searchPanel.find('.replace-all');
    const $closeButton = $searchPanel.find('.close-search');
    const $toggleReplaceButton = $searchPanel.find('.toggle-replace');
    const $replaceRow = $searchPanel.find('.replace-row');
    const $matchCount = $searchPanel.find('.match-count');
    const $matchCaseButton = $searchPanel.find('.match-case');
    const $matchWordButton = $searchPanel.find('.match-word');
    const $useRegexButton = $searchPanel.find('.use-regex');

    // Handle Escape key on editor
    editor.on('keydown', function(cm, e) {
        if (e.key === 'Escape' && $searchPanel.is(':visible')) {
            hideSearchPanel();
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // Handle Escape key on search panel
    $searchPanel.on('keydown', function(e) {
        if (e.key === 'Escape') {
            hideSearchPanel();
            e.preventDefault();
            e.stopPropagation();
        }
    });

    function toggleMatchCase() {
        matchCase = !matchCase;
        $matchCaseButton.toggleClass('active', matchCase);
        if ($searchInput.val()) {
            debouncedHighlight($searchInput.val());
        }
    }

    function toggleMatchWord() {
        matchWord = !matchWord;
        $matchWordButton.toggleClass('active', matchWord);
        if ($searchInput.val()) {
            debouncedHighlight($searchInput.val());
        }
    }

    function toggleUseRegex() {
        useRegex = !useRegex;
        $useRegexButton.toggleClass('active', useRegex);
        if ($searchInput.val()) {
            debouncedHighlight($searchInput.val());
        }
    }

    function showSearchPanel(showReplace = false) {
        $searchPanel.show();
        
        // Get selected text from editor
        const selectedText = editor.getSelection();
        if (selectedText) {
            $searchInput.val(selectedText);
            debouncedHighlight(selectedText);
        }
        
        $searchInput.focus().select().trigger('input');
        if (showReplace) {
            toggleReplace();
        }
    }

    function hideSearchPanel() {
        $searchPanel.hide();
        editor.focus();
        clearSearch();
    }

    function toggleReplace() {
        $replaceRow.toggleClass('hidden');
        // $toggleReplaceButton.text($toggleReplaceButton.text() === '▼' ? '▲' : '▼');
        const icon = $toggleReplaceButton.hasClass('angle right') ? 'angle down' : 'angle right';
        $toggleReplaceButton.removeClass('angle right').addClass(icon);
    }

    function clearSearch() {
        searchMarks.forEach(mark => mark.clear());
        searchMarks = [];
        searchCursor = null;
        currentMatchIndex = 0;
        totalMatches = 0;
        updateMatchCount();
    }

    function updateMatchCount() {
        if (totalMatches === 0) {
            $matchCount.text('');
        } else {
            $matchCount.text(`${currentMatchIndex + 1} of ${totalMatches}`);
        }
    }

    function getSearchRegex(searchText) {
        if (useRegex) {
            try {
                return new RegExp(searchText, matchCase ? 'g' : 'gi');
            } catch (e) {
                return null;
            }
        } else {
            const escapedText = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = matchWord ? `\\b${escapedText}\\b` : escapedText;
            return new RegExp(pattern, matchCase ? 'g' : 'gi');
        }
    }

    function debouncedHighlight(searchText) {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        searchTimeout = setTimeout(() => {
            highlightMatches(searchText);
        }, 150);
    }

    function highlightMatches(searchText) {
        clearSearch();
        if (!searchText) return;

        const regex = getSearchRegex(searchText);
        if (!regex) return;

        searchCursor = editor.getSearchCursor(regex);
        
        while (searchCursor.findNext()) {
            const mark = editor.markText(searchCursor.from(), searchCursor.to(), {
                className: 'cm-searching'
            });
            searchMarks.push(mark);
        }

        totalMatches = searchMarks.length;
        
        // Only set selection and scroll if this is not from editor change
        if (!editorChangeTimeout) {
            searchCursor = editor.getSearchCursor(regex);
            if (searchCursor.findNext()) {
                editor.setSelection(searchCursor.from(), searchCursor.to());
                editor.scrollIntoView(searchCursor.from(), 50);
                currentMatchIndex = 0;
            }
        }
        
        updateMatchCount();
    }

    function findNext() {
        if (!searchCursor || totalMatches === 0) return;
        
        if (!searchCursor.findNext()) {
            searchCursor = editor.getSearchCursor(getSearchRegex($searchInput.val()));
            searchCursor.findNext();
            currentMatchIndex = 0;
        } else {
            currentMatchIndex = (currentMatchIndex + 1) % totalMatches;
        }
        
        editor.setSelection(searchCursor.from(), searchCursor.to());
        editor.scrollIntoView(searchCursor.from(), 50);
        updateMatchCount();
    }

    function findPrevious() {
        if (!searchCursor || totalMatches === 0) return;
        
        if (!searchCursor.findPrevious()) {
            searchCursor = editor.getSearchCursor(getSearchRegex($searchInput.val()));
            searchCursor.findPrevious();
            currentMatchIndex = totalMatches - 1;
        } else {
            currentMatchIndex = (currentMatchIndex - 1 + totalMatches) % totalMatches;
        }
        
        editor.setSelection(searchCursor.from(), searchCursor.to());
        editor.scrollIntoView(searchCursor.from(), 50);
        updateMatchCount();
    }

    function replaceCurrent() {
        if (!searchCursor || !searchCursor.from()) return;
        
        const replaceText = $replaceInput.val();
        editor.replaceRange(replaceText, searchCursor.from(), searchCursor.to());
        
        debouncedHighlight($searchInput.val());
    }

    function replaceAll() {
        const searchText = $searchInput.val();
        const replaceText = $replaceInput.val();
        if (!searchText) return;

        const regex = getSearchRegex(searchText);
        if (!regex) return;

        const matches = [];
        let cursor = editor.getSearchCursor(regex);
        while (cursor.findNext()) {
            matches.push({
                from: cursor.from(),
                to: cursor.to()
            });
        }

        for (let i = matches.length - 1; i >= 0; i--) {
            editor.replaceRange(replaceText, matches[i].from, matches[i].to);
        }

        debouncedHighlight(searchText);
    }

    // Add paste event listener to editor
    editor.on('paste', function() {
        if ($searchPanel.is(':visible') && $searchInput.val()) {
            // Small delay to allow paste to complete
            setTimeout(() => {
                debouncedHighlight($searchInput.val());
            }, 0);
        }
    });

    // Event listeners
    $searchInput.on('input', function() {
        debouncedHighlight($(this).val());
    });

    // Add change event listener to editor
    let editorChangeTimeout = null;
    editor.on('change', function() {
        if ($searchPanel.is(':visible') && $searchInput.val()) {
            // Clear any existing timeout
            if (editorChangeTimeout) {
                clearTimeout(editorChangeTimeout);
            }
            // Debounce the search to avoid too frequent updates
            editorChangeTimeout = setTimeout(() => {
                debouncedHighlight($searchInput.val());
            }, 150);
        }
    });

    $matchCaseButton.on('click', toggleMatchCase);
    $matchWordButton.on('click', toggleMatchWord);
    $useRegexButton.on('click', toggleUseRegex);
    $toggleReplaceButton.on('click', toggleReplace);
    $nextButton.on('click', findNext);
    $prevButton.on('click', findPrevious);
    $replaceButton.on('click', replaceCurrent);
    $replaceAllButton.on('click', replaceAll);
    $closeButton.on('click', hideSearchPanel);

    // Keyboard shortcuts
    editor.addKeyMap({
        'Ctrl-F': function() {
            showSearchPanel();
            return true;
        },
        'Ctrl-H': function() {
            showSearchPanel(true);
            return true;
        },
        'Alt-C': function() {
            toggleMatchCase();
            return true;
        },
        'Alt-W': function() {
            toggleMatchWord();
            return true;
        },
        'Alt-R': function() {
            toggleUseRegex();
            return true;
        }
    });

    

    $searchInput.on('keydown', function(e) {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                findPrevious();
            } else {
                findNext();
            }
            e.preventDefault();
        }
    });

    $replaceInput.on('keydown', function(e) {
        if (e.key === 'Enter' && e.altKey) {
            replaceAll();
            e.preventDefault();
        }
    });

    // Store the search panel in the editor instance
    editor.state.search = {
        panel: $searchPanel,
        show: showSearchPanel,
        hide: hideSearchPanel
    };
}