package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration;
import java.util.List;

public class ItemPage {
    private WebDriver driver;
    private WebDriverWait wait;

    // Locators
    private By addItemButton = By.id("addItemButton"); // Updated to ID
    private By newItemNameInput = By.id("newItemInput"); // Specific input for new item
    private By editItemNameInput = By.id("editItemInput"); // Specific input for editing item
    public By saveItemButton = By.id("saveItemButton"); // Specific button for saving edits

    private By itemList = By.id("itemList");
    private By editButton = By.cssSelector(".edit-btn");
    private By deleteButton = By.cssSelector(".delete-btn");
    private By logoutButton = By.id("logoutBtn");
    private By itemErrorMessage = By.xpath("//*[@id=\"root\"]/div/div/div/p"); // Updated to ID for item errors
    private By itemEmptyErrorMessage = By.cssSelector("#root > div > div > div > p");
    // Locators for the custom modal
    private By confirmButton = By.id("confirmButton");
    private By cancelButton = By.id("cancelButton");

    private By itemBox = By.id("editItemInput");

    // Constructor
    public ItemPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // --- Public Getters for Locators (for use in other test classes) ---
    public By getAddItemButtonLocator() {
        return addItemButton;
    }

    // --- Actions ---
    public void clickAddItemButton() {
        wait.until(ExpectedConditions.elementToBeClickable(addItemButton)).click();
    }
    public void clearItemBox() {
        driver.findElement(itemBox).clear();
    }

    public void enterNewItemName(String name) {
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(newItemNameInput));
        input.clear();
        input.sendKeys(name);
    }

    public void enterEditItemName(String name) {
        WebElement input = wait.until(ExpectedConditions.visibilityOfElementLocated(editItemNameInput));
        input.clear();
        input.sendKeys(name);
    }
    /**
     * Helper method to find a specific item's <li> element by its name.
     * @param itemName The name of the item to find.
     * @return The WebElement representing the <li> row, or null if not found.
     */
    private WebElement findItemRowByName(String itemName) {
        By itemListItem = By.cssSelector("#itemList li");
        wait.until(ExpectedConditions.visibilityOfElementLocated(itemList)); // Ensure list is loaded
        List<WebElement> items = driver.findElements(itemListItem);
        for (WebElement item : items) {
            if (item.getText().contains(itemName)) {
                return item;
            }
        }
        return null;
    }

    public void clickSaveItemButton() {
        wait.until(ExpectedConditions.elementToBeClickable(saveItemButton)).click();


    }

    public void createItem(String name)  {
        enterNewItemName(name);

        clickAddItemButton();

    }

    public void editItemByName(String originalName, String newName)  {
        WebElement itemRow = findItemRowByName(originalName);
        if (itemRow == null) {
            throw new RuntimeException("Item with name '" + originalName + "' not found for editing.");
        }

        // Click the edit button within that specific item's row
        itemRow.findElement(editButton).click();

        // Wait for the edit input and save button to become visible
        wait.until(ExpectedConditions.visibilityOfElementLocated(editItemNameInput));
        wait.until(ExpectedConditions.elementToBeClickable(saveItemButton));

        // Enter the new name and save
        enterEditItemName(newName);

        clickSaveItemButton();



    }
    public void editItemToBeEmpty(String originalName)  {
        WebElement itemRow = findItemRowByName(originalName);
        if (itemRow == null) {
            throw new RuntimeException("Item with name '" + originalName + "' not found for editing.");
        }

        // Click the edit button within that specific item's row
        itemRow.findElement(editButton).click();

        // Wait for the edit input and save button to become visible
        wait.until(ExpectedConditions.visibilityOfElementLocated(editItemNameInput));
        wait.until(ExpectedConditions.elementToBeClickable(saveItemButton));

        // Enter the new name and save
        driver.findElement(itemBox).clear();
        driver.findElement(itemBox).sendKeys("");

        clickSaveItemButton();



    }
    public void deleteFirstItem() {
        // Find and click the first delete button
        wait.until(ExpectedConditions.elementToBeClickable(deleteButton)).click();
        // Handle the custom confirmation modal
        wait.until(ExpectedConditions.elementToBeClickable(confirmButton)).click();
    }

    public String getItemListText() {
        // Wait for the item list to be visible before getting text
        return wait.until(ExpectedConditions.visibilityOfElementLocated(itemList)).getText();
    }

    // ItemPage.java
    public String getErrorMessage() {
        try {
            // This should now correctly use By.id("itemErrorMessage")
            WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(itemEmptyErrorMessage));
            return errorElement.getText();
        } catch (Exception e) {
            System.out.println("Item error message element not found or not visible within timeout: " + e.getMessage());
            return ""; // Return empty string if not found/visible
        }
    }

    public void logout() {
        wait.until(ExpectedConditions.elementToBeClickable(logoutButton)).click();
    }

    public boolean isItemErrorMessageDisplayed() {
        try {
            return wait.until(ExpectedConditions.visibilityOfElementLocated(itemErrorMessage)).isDisplayed();
        } catch (Exception e) {
            return false; // Error message not found
        }
    }

    // --- Helper Method for Visibility Check ---
    public boolean isElementVisible(By locator) {
        try {
            // Use a short explicit wait to check for visibility without failing immediately
            WebDriverWait shortWait = new WebDriverWait(driver, Duration.ofSeconds(2)); // Short wait
            return shortWait.until(ExpectedConditions.visibilityOfElementLocated(locator)).isDisplayed();
        } catch (Exception e) {
            return false; // Element not found or not visible within the wait time
        }
    }
}
