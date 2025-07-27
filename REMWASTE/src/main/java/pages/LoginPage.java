package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.time.Duration; // For WebDriverWait

public class LoginPage {
    private WebDriver driver;
    private WebDriverWait wait; // For explicit waits

    // Locators
    private By usernameInput = By.id("username"); // Updated to ID
    private By passwordInput = By.id("password"); // Updated to ID
    private By loginButton = By.id("loginButton"); // Updated to ID
    private By errorMessage = By.xpath("//*[@id=\"root\"]/div/div/div/p"); // Updated to ID

    // Constructor
    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // Initialize WebDriverWait
    }

    // Actions
    public void enterUsername(String username) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(usernameInput)).sendKeys(username);
    }

    public void enterPassword(String password) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(passwordInput)).sendKeys(password);
    }

    public void clickLogin() {
        wait.until(ExpectedConditions.elementToBeClickable(loginButton)).click();
    }

    public void login(String username, String password) {
        driver.get("http://localhost:3000/"); // Ensure you start at the base URL (adjust if your app runs on 3000)
        enterUsername(username);
        enterPassword(password);
        clickLogin();
    }

    public String getErrorMessage() {
        // Wait for the error message to be visible
        WebElement errorElement = wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage));
        return errorElement.getText();
    }

    public boolean isLoginPageDisplayed() {
        // Check if login elements are present
        return driver.findElements(usernameInput).size() > 0 && driver.findElements(loginButton).size() > 0;
    }
}