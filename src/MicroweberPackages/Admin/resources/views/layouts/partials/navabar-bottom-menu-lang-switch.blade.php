<div class="dropdown-divider"></div>

<?php
$selectedLang = $currentLang = current_lang();
if (isset($_COOKIE['lang'])) {
    $selectedLang = $_COOKIE['lang'];
}
$supportedLanguages = \MicroweberPackages\Translation\TranslationPackageInstallHelper::getAvailableTranslations('json');


if ($supportedLanguages !== null) {
?>

<script>
    $(document).ready(function () {
        mw.$("#lang_selector").on("change", function () {
            mw.cookie.set("lang", $(this).val());
            $.ajax({
                type: "GET",
                url: mw.settings.api_url + "set_current_lang",
                data: {lang:$(this).val()}
            }).always(function (){
                window.location.reload();
            });
        });
    });
</script>

<div class="form-group">
    <label class="text-muted"><?php _e("Language"); ?>:</label>

    <select class="form-select d-block" data-style="btn-sm" data-size="5" data-live-search="true" name="lang" id="lang_selector" data-width="100%" data-title="<?php if ($currentLang != 'en_US' and $currentLang != 'undefined'): ?><?php print \MicroweberPackages\Translation\LanguageHelper::getDisplayLanguage($currentLang); ?><?php else: ?>English<?php endif; ?>">

        <?php foreach ($supportedLanguages as $languageLocale=>$languageDisplayName): ?>
        <option value="<?php print $languageLocale; ?>"
                <?php if ($selectedLang == $languageLocale) { ?> selected="selected" <?php } ?>>
            <?php echo $languageDisplayName; ?>
            [<?php echo $languageLocale; ?>]
        </option>
        <?php endforeach; ?>
    </select>
</div>
<?php
}
?>
