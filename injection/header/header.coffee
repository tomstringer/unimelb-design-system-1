window.UOMinjectHeader = ->
  # Create page wrapper if it doesn't already exist
  parent = document.body
  page = document.querySelector('.page-inner')
  unless page
    page = document.createElement('div')
    page.addClass('page-inner')

  main = document.querySelector('[role="main"]')
  unless main
    main = document.createElement('div')
    main.setAttribute('role', 'main')
  else
    main.parentNode.removeChild(main)

  footer = document.querySelector('.page-footer')
  page.insertBefore(main, footer)

  sitemap = document.querySelector('[role="sitemap"]')
  for n in parent.childNodes
    if n and n != page and n != sitemap
      parent.removeChild(n)
      main.appendChild(n)

  if parent.childNodes > 0
    parent.insertBefore(page, parent.firstChild)
  else
    parent.appendChild(page)

  # Create header if it doesn't already exist
  header = document.querySelector('.page-header')
  unless header
    # Create header and move local breadcrumb
    header = document.createElement('div')
    header.addClass('page-header')

    if document.countSelector('.page-inner > .floating') > 0
      # Landing page header
      header.innerHTML = """
      <a class="page-header-logo" href="/">Home</a>
      """
      header.addClass('floating')
      if document.querySelector('.page-inner > .floating').hasClass('reverse')
        header.addClass('reverse')

    else
      # General header
      header.innerHTML = """
      <header>
        <a class="page-header-logo" href="/">Home</a>
        <div class="page-header-navigation">
          <a href="https://unimelb.edu.au/" title="The University of Melbourne">The University of Melbourne</a>
        </div>
      </header>
      """

    page.insertBefore(header, page.firstChild)

    local = document.querySelector('.page-local-history')
    if local
      local.parentNode.removeChild(local)
      parent = document.querySelector('.page-header-navigation')
      sep = document.createElement "span"
      sep.innerHTML = "/"
      parent.appendChild(sep)
      parent.appendChild(local)

  # Set up login modal and attach to page
  login = document.querySelector('.page-login')
  unless login
    if document.countSelector('[role="main"].no-login') == 0
      login = document.createElement "div"
      login.addClass('modal__dialog')
      login.addClass('page-login')
      login.id = 'uom-login'
      login.innerHTML = """
              <h2 class="title">Please Choose</h2>
              <div class="half">
                <a class="button-fill" href="https://my.unimelb.edu.au/studentportal/faces/home">
                  <i class="icon-student"></i>
                  <h2>Current Student</h2>
                  <p>Click here to get to the student portal</p>
                </a>
                <a class="button-fill" href="https://staff.unimelb.edu.au">
                  <i class="icon-staff"></i>
                  <h2>Staff Member</h2>
                  <p>Click here to get to the staff portal</p>
                </a>
              </div>
      """
      page.appendChild login

  # Header tools
  tools = document.querySelector('.page-header-tools')
  unless tools
    tools = document.createElement "div"
    tools.addClass('page-header-tools')
    if document.countSelector('[role="main"].no-login') == 0
      tools.innerHTML = """
            <a class="page-header-icon" href="#sitemap" title="Search"><span class="icon search"></span> Search</a><!--
            --><a class="page-header-icon" href="#sitemap" title="Login" data-modal-target="uom-login"><span class="icon login"></span> Portal</a><!--
            --><a class="page-header-icon" href="#sitemap" title="Menu"><span class="icon menu"></span> Menu</a>
      """
    else
      tools.innerHTML = """
            <a class="page-header-icon" href="#sitemap" title="Search"><span class="icon search"></span> Search</a><!--
            --><a class="page-header-icon" href="#sitemap" title="Menu"><span class="icon menu"></span> Menu</a>
      """

    header.appendChild tools
