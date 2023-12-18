export class Tabs {
    constructor(tabsNav, tabsContent) {
        this.tabsNav = tabsNav;
        this.tabsContent = tabsContent;
        this.activeTab = this.tabsNav.querySelector(".is-active");

        this.tabsNav.addEventListener("click", event => {
            this.changeTab(event.target);
        })
    }

    changeTab(clickedTab) {
        this.activeTab.classList.remove('is-active');
        this.tabsContent.querySelector('.is-active').classList.remove('is-active');
        clickedTab.classList.add('is-active');
        this.tabsContent.querySelector(`#${clickedTab.dataset.content}`).classList.add('is-active');
        this.activeTab = clickedTab;
    }
}