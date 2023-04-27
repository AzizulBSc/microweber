<li class="nav-item @if(isset($class)) {{$class}} @endif">
    <a href="{{$item->url()}}" class="nav-link fs-3" @if($item->active) x-init="setTimeout(function() { $el.classList.add('active'); }, 300);" @endif">
        @if($item->icon)
            {!! $item->icon !!}
        @endif
        <span>
           <div x-init="setTimeout(function() { $el.classList.remove('placeholder'); $el.classList.remove('placeholder-xs'); }, 300);" class="placeholder placeholder-xs">
                {{$item->text()}}
           </div>
        </span>
    </a>
</li>
